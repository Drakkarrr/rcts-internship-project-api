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
const PaymentModel = mongoose.model('Payment');
const summary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let defaultType = 'month';
    const { type, currency } = req.query;
    const settings = yield loadSettings();
    const currentCurrency = currency
        ? currency.toString().toUpperCase()
        : settings['default_currency_code'].toUpperCase();
    if (type) {
        if (['week', 'month', 'year'].includes(type.toString())) {
            defaultType = type.toString();
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
    try {
        const result = yield PaymentModel.aggregate([
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
                    _id: null,
                    count: {
                        $sum: 1,
                    },
                    total: {
                        $sum: '$amount',
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    count: 1,
                    total: 1,
                },
            },
        ]);
        return res.status(200).json({
            success: true,
            result: result.length > 0 ? result[0] : { count: 0, total: 0 },
            message: `Successfully fetched the summary of payment invoices for the last ${defaultType}`,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Internal Server Error',
        });
    }
});
export default summary;
