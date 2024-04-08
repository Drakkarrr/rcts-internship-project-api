import mongoose from 'mongoose';
import { calculate } from '@/helpers';
const PaymentModel = mongoose.model('Payment');
const InvoiceModel = mongoose.model('Invoice');
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const previousPayment = await PaymentModel.findOne({
            _id: id,
            removed: false,
        });
        if (!previousPayment) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No document found',
            });
        }
        const { amount: previousAmount, invoice: { _id: invoiceId, total, discount, credit: previousCredit }, } = previousPayment;
        const { amount: currentAmount } = req.body;
        if (currentAmount === 0) {
            return res.status(202).json({
                success: false,
                result: null,
                message: `The Minimum Amount couldn't be 0`,
            });
        }
        const changedAmount = calculate.sub(currentAmount, previousAmount);
        const maxAmount = calculate.sub(total, calculate.add(discount, previousCredit));
        if (changedAmount > maxAmount) {
            return res.status(202).json({
                success: false,
                result: null,
                message: `The Max Amount you can add is ${maxAmount + previousAmount}`,
                error: `The Max Amount you can add is ${maxAmount + previousAmount}`,
            });
        }
        let paymentStatus = calculate.sub(total, discount) === calculate.add(previousCredit, changedAmount)
            ? 'paid'
            : Number(calculate.add(previousCredit, changedAmount)) > 0
                ? 'partially'
                : 'unpaid';
        const updatedDate = new Date();
        const updates = {
            number: req.body.number,
            date: req.body.date,
            amount: req.body.amount,
            paymentMode: req.body.paymentMode,
            ref: req.body.ref,
            description: req.body.description,
            updated: updatedDate,
        };
        const result = await PaymentModel.findOneAndUpdate({ _id: id, removed: false }, { $set: updates }, {
            new: true,
        }).exec();
        const updateInvoice = await InvoiceModel.findOneAndUpdate({ _id: invoiceId }, {
            $inc: { credit: changedAmount },
            $set: {
                paymentStatus: paymentStatus,
            },
        }, {
            new: true,
        }).exec();
        return res.status(200).json({
            success: true,
            result,
            message: 'Successfully updated the Payment',
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
export default update;
