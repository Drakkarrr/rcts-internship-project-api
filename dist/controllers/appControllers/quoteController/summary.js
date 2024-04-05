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
import { loadSettings } from '@/middlewares/settings';
const Model = mongoose.model('Quote');
const summary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let defaultType = 'month';
    const { type, currency } = req.query;
    const settings = yield loadSettings();
    const currentCurrency = currency
        ? currency.toUpperCase()
        : settings['default_currency_code'].toUpperCase();
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
    const currentDate = moment();
    let startDate = currentDate.clone().startOf(defaultType);
    let endDate = currentDate.clone().endOf(defaultType);
    const statuses = ['draft', 'pending', 'sent', 'expired', 'declined', 'accepted'];
    const result = yield Model.aggregate([
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
            $group: {
                _id: '$status',
                count: {
                    $sum: 1,
                },
                total_amount: {
                    $sum: '$total',
                },
            },
        },
        {
            $group: {
                _id: null,
                total_count: {
                    $sum: '$count',
                },
                results: {
                    $push: '$$ROOT',
                },
            },
        },
        {
            $unwind: '$results',
        },
        {
            $project: {
                _id: 0,
                status: '$results._id',
                count: '$results.count',
                percentage: {
                    $round: [{ $multiply: [{ $divide: ['$results.count', '$total_count'] }, 100] }, 0],
                },
                total_amount: '$results.total_amount',
            },
        },
        {
            $sort: {
                status: 1,
            },
        },
    ]);
    statuses.forEach((status) => {
        const found = result.find((item) => item.status === status);
        if (!found) {
            result.push({
                status,
                count: 0,
                percentage: 0,
                total_amount: 0,
            });
        }
    });
    const total = result.reduce((acc, item) => acc + item.total_amount, 0);
    const finalResult = {
        total,
        type: defaultType,
        performance: result,
    };
    return res.status(200).json({
        success: true,
        result: finalResult,
        message: `Successfully found all Quotations for the last ${defaultType}`,
    });
});
export default summary;
