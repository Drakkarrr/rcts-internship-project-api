var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from 'mongoose';
import moment from 'moment';
const Model = mongoose.model('Offer');
const summary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let defaultType = 'month';
        const { type, currency } = req.query;
        if (type) {
            if (['week', 'month', 'year'].includes(type)) {
                defaultType = type;
            }
            else {
                return res.status(400).json({
                    success: false,
                    result: null,
                    message: 'Invalid type',
                });
            }
        }
        const currentCurrency = currency
            ? currency.toUpperCase()
            : settings['default_currency_code'].toUpperCase();
        const currentDate = moment();
        const startDate = currentDate.clone().startOf(defaultType);
        const endDate = currentDate.clone().endOf(defaultType);
        const statuses = ['draft', 'pending', 'sent', 'expired', 'declined', 'accepted'];
        const response = yield Model.aggregate([
            {
                $match: {
                    removed: false,
                    currency: currentCurrency,
                    // date: {
                    //   $gte: startDate.toDate(),
                    //   $lte: endDate.toDate(),
                    // },
                },
            },
            {
                $facet: {
                    totalOffer: [
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
                },
            },
        ]);
        let result = [];
        const totalOffers = response[0].totalOffer ? response[0].totalOffer[0] : { total: 0, count: 0 };
        const statusResult = response[0].statusCounts || [];
        const statusResultMap = statusResult.map((item) => (Object.assign(Object.assign({}, item), { percentage: Math.round((item.count / totalOffers.count) * 100) })));
        statuses.forEach((status) => {
            const found = [...statusResultMap].find((item) => item.status === status);
            if (found) {
                result.push(found);
            }
        });
        const finalResult = {
            total: totalOffers.total,
            type,
            performance: result,
        };
        return res.status(200).json({
            success: true,
            result: finalResult,
            message: `Successfully found all invoices for the last ${defaultType}`,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
});
export default summary;
