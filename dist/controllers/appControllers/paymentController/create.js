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
const Model = mongoose.model('Payment');
const Invoice = mongoose.model('Invoice');
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.amount === 0) {
        return res.status(202).json({
            success: false,
            result: null,
            message: `The Minimum Amount couldn't be 0`,
        });
    }
    const currentInvoice = yield Invoice.findOne({
        _id: req.body.invoice,
        removed: false,
    });
    const { total: previousTotal, discount: previousDiscount, credit: previousCredit, } = currentInvoice;
    const maxAmount = calculate.sub(calculate.sub(previousTotal, previousDiscount), previousCredit);
    if (req.body.amount > maxAmount) {
        return res.status(202).json({
            success: false,
            result: null,
            message: `The Max Amount you can add is ${maxAmount}`,
        });
    }
    req.body['createdBy'] = req.admin._id;
    req.body['currency'] = currentInvoice.currency;
    const result = yield Model.create(req.body);
    const fileId = 'payment-' + result._id + '.pdf';
    const updatePath = yield Model.findOneAndUpdate({
        _id: result._id.toString(),
        removed: false,
    }, { pdf: fileId }, {
        new: true,
    }).exec();
    const { _id: paymentId, amount } = result;
    const { id: invoiceId, total, discount, credit } = currentInvoice;
    let paymentStatus = calculate.sub(total, discount) === calculate.add(credit, amount)
        ? 'paid'
        : Number(calculate.add(credit, amount)) > 0
            ? 'partially'
            : 'unpaid';
    const invoiceUpdate = yield Invoice.findOneAndUpdate({ _id: req.body.invoice }, {
        $push: { payment: paymentId.toString() },
        $inc: { credit: amount },
        $set: { paymentStatus: paymentStatus },
    }, {
        new: true,
        runValidators: true,
    }).exec();
    return res.status(200).json({
        success: true,
        result: updatePath,
        message: 'Payment Invoice created successfully',
    });
});
export default create;
