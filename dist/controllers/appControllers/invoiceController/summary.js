var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Model } from 'mongoose';
import moment from 'moment';
import { loadSettings } from '@/middlewares/settings';
const summary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let defaultType = 'month';
    const { type, currency } = req.query;
    const settings = yield loadSettings();
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
    const response = yield Model.aggregate([
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
    const totalInvoices = ((_a = response[0].totalInvoice) === null || _a === void 0 ? void 0 : _a[0]) || {
        total: 0,
        count: 0,
    };
    const statusResult = response[0].statusCounts || [];
    const paymentStatusResult = response[0].paymentStatusCounts || [];
    const overdueResult = response[0].overdueCounts || [];
    const statusResultMap = statusResult.map((item) => (Object.assign(Object.assign({}, item), { percentage: Math.round((item.count / totalInvoices.count) * 100) })));
    const paymentStatusResultMap = paymentStatusResult.map((item) => (Object.assign(Object.assign({}, item), { percentage: Math.round((item.count / totalInvoices.count) * 100) })));
    const overdueResultMap = overdueResult.map((item) => (Object.assign(Object.assign({}, item), { status: 'overdue', percentage: Math.round((item.count / totalInvoices.count) * 100) })));
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
    const unpaid = yield Model.aggregate([
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
});
export default summary;
