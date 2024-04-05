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
import { calculate } from '@/helpers';
const PaymentModel = mongoose.model('Payment');
const InvoiceModel = mongoose.model('Invoice');
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const previousPayment = yield PaymentModel.findOne({
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
        const result = yield PaymentModel.findOneAndUpdate({ _id: id, removed: false }, { $set: updates }, {
            new: true,
        }).exec();
        const updateInvoice = yield InvoiceModel.findOneAndUpdate({ _id: invoiceId }, {
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
});
export default update;
