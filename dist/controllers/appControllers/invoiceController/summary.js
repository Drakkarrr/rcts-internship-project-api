import { Model } from 'mongoose';
import moment from 'moment';
import { loadSettings } from '@/middlewares/settings';
const summary = async (req, res) => {
    let defaultType = 'month';
    const { type, currency } = req.query;
    const settings = await loadSettings();
    const currentCurrency = currency
        ? currency.toUpperCase()
        : settings['default_currency_code'].toUpperCase();
    if (type) {
        if (!['week', 'month', 'year'].includes(type)) {
            return res.status(400).json({
                success: false,
                result: null,
                message: 'Invalid type',
            });
        }
        defaultType = type;
    }
    const currentDate = moment();
    const startDate = currentDate.clone().startOf(defaultType);
    const endDate = currentDate.clone().endOf(defaultType);
    const statuses = ['draft', 'pending', 'overdue', 'paid', 'unpaid', 'partially'];
    const response = await Model.aggregate([
        {
            $match: {
                removed: false,
                currency: currentCurrency,
            },
        },
        {
            $facet: {
                totalInvoice: [
                    {
                        $group: {
                            _id: null,
                            total: {
                                $sum: '$total',
                            },
                            count: {
                                $sum: 1,
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            total: '$total',
                            count: '$count',
                        },
                    },
                ],
                statusCounts: [
                    {
                        $group: {
                            _id: '$status',
                            count: {
                                $sum: 1,
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            status: '$_id',
                            count: '$count',
                        },
                    },
                ],
                paymentStatusCounts: [
                    {
                        $group: {
                            _id: '$paymentStatus',
                            count: {
                                $sum: 1,
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            status: '$_id',
                            count: '$count',
                        },
                    },
                ],
                overdueCounts: [
                    {
                        $match: {
                            expiredDate: {
                                $lt: new Date(),
                            },
                        },
                    },
                    {
                        $group: {
                            _id: '$status',
                            count: {
                                $sum: 1,
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            status: '$_id',
                            count: '$count',
                        },
                    },
                ],
            },
        },
    ]);
    let result = [];
    const totalInvoices = response[0].totalInvoice?.[0] || {
        total: 0,
        count: 0,
    };
    const statusResult = response[0].statusCounts || [];
    const paymentStatusResult = response[0].paymentStatusCounts || [];
    const overdueResult = response[0].overdueCounts || [];
    const statusResultMap = statusResult.map((item) => ({
        ...item,
        percentage: Math.round((item.count / totalInvoices.count) * 100),
    }));
    const paymentStatusResultMap = paymentStatusResult.map((item) => ({
        ...item,
        percentage: Math.round((item.count / totalInvoices.count) * 100),
    }));
    const overdueResultMap = overdueResult.map((item) => ({
        ...item,
        status: 'overdue',
        percentage: Math.round((item.count / totalInvoices.count) * 100),
    }));
    statuses.forEach((status) => {
        const found = [
            ...paymentStatusResultMap,
            ...statusResultMap,
            ...overdueResultMap,
        ].find((item) => item.status === status);
        if (found) {
            result.push(found);
        }
    });
    const unpaid = await Model.aggregate([
        {
            $match: {
                removed: false,
                currency: currentCurrency,
                paymentStatus: { $in: ['unpaid', 'partially'] },
            },
        },
        {
            $group: {
                _id: null,
                total_amount: {
                    $sum: { $subtract: ['$total', '$credit'] },
                },
            },
        },
        {
            $project: {
                _id: 0,
                total_amount: '$total_amount',
            },
        },
    ]);
    const finalResult = {
        total: totalInvoices.total,
        total_undue: unpaid.length > 0 ? unpaid[0].total_amount : 0,
        type: defaultType,
        performance: result,
    };
    return res.status(200).json({
        success: true,
        result: finalResult,
        message: `Successfully found all invoices for the last ${defaultType}`,
    });
};
export default summary;
//# sourceMappingURL=summary.js.map