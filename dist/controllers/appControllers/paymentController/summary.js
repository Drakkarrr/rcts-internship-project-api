import mongoose from 'mongoose';
import moment from 'moment';
import { loadSettings } from '@/middlewares/settings';
const PaymentModel = mongoose.model('Payment');
const summary = async (req, res) => {
    let defaultType = 'month';
    const { type, currency } = req.query;
    const settings = await loadSettings();
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
        const result = await PaymentModel.aggregate([
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
};
export default summary;
//# sourceMappingURL=summary.js.map