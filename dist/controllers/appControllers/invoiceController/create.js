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
import { checkCurrency } from '@/utils/currency';
import { calculate } from '@/helpers';
import { increaseBySettingKey } from '@/middlewares/settings';
import schema from './schemaValidate';
const Model = mongoose.model('Invoice');
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const { items = [], taxRate = 0, discount = 0, currency } = value;
    let subTotal = 0;
    let taxTotal = 0;
    let total = 0;
    if (!checkCurrency(currency)) {
        return res.status(400).json({
            success: false,
            result: null,
            message: "currency doesn't exist",
        });
    }
    items.map((item) => {
        let itemTotal = calculate.multiply(item['quantity'], item['price']);
        subTotal = calculate.add(subTotal, itemTotal);
        item['total'] = itemTotal;
    });
    taxTotal = calculate.multiply(subTotal, taxRate / 100);
    total = calculate.add(subTotal, taxTotal);
    body['subTotal'] = subTotal;
    body['taxTotal'] = taxTotal;
    body['total'] = total;
    body['items'] = items;
    let paymentStatus = calculate.sub(total, discount) === 0 ? 'paid' : 'unpaid';
    body['paymentStatus'] = paymentStatus;
    body['createdBy'] = req.admin._id;
    const result = yield new Model(body).save();
    const fileId = 'invoice-' + result._id + '.pdf';
    const updateResult = yield Model.findOneAndUpdate({ _id: result._id }, { pdf: fileId }, {
        new: true,
    }).exec();
    increaseBySettingKey({
        settingKey: 'last_invoice_number',
    });
    return res.status(200).json({
        success: true,
        result: updateResult,
        message: 'Invoice created successfully',
    });
});
export default create;
