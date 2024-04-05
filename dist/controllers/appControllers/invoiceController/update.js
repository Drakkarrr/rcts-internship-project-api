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
import schema from './schemaValidate';
const Model = mongoose.model('Invoice');
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let body = req.body;
    const { error, value } = schema.validate(body);
    if (error) {
        const { details } = error;
        return res.status(400).json({
            success: false,
            result: null,
            message: (_a = details[0]) === null || _a === void 0 ? void 0 : _a.message,
        });
    }
    const previousInvoice = yield Model.findOne({
        _id: req.params.id,
        removed: false,
    });
    if (!previousInvoice) {
        return res.status(404).json({
            success: false,
            result: null,
            message: 'No invoice found with the provided ID',
        });
    }
    const { credit } = previousInvoice;
    const { items = [], taxRate = 0, discount = 0 } = req.body;
    if (items.length === 0) {
        return res.status(400).json({
            success: false,
            result: null,
            message: 'Items cannot be empty',
        });
    }
    // default
    let subTotal = 0;
    let taxTotal = 0;
    let total = 0;
    //Calculate the items array with subTotal, total, taxTotal
    items.forEach((item) => {
        let itemTotal = calculate.multiply(item.quantity, item.price);
        //sub total
        subTotal = calculate.add(subTotal, itemTotal);
        //item total
        item.total = itemTotal;
    });
    taxTotal = calculate.multiply(subTotal, taxRate / 100);
    total = calculate.add(subTotal, taxTotal);
    body.subTotal = subTotal;
    body.taxTotal = taxTotal;
    body.total = total;
    body.items = items;
    body.pdf = `invoice-${req.params.id}.pdf`;
    if (body.hasOwnProperty('currency')) {
        delete body.currency;
    }
    let paymentStatus = calculate.sub(total, discount) === credit ? 'paid' : credit > 0 ? 'partially' : 'unpaid';
    body.paymentStatus = paymentStatus;
    const result = yield Model.findOneAndUpdate({ _id: req.params.id, removed: false }, body, {
        new: true,
    }).exec();
    return res.status(200).json({
        success: true,
        result,
        message: 'Invoice updated successfully',
    });
});
export default update;
