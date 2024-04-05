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
import { increaseBySettingKey } from '@/middlewares/settings';
import { calculate } from '@/helpers';
const QuoteModel = mongoose.model('Quote');
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { items = [], taxRate = 0, discount = 0, currency } = req.body;
        // default
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
        // Calculate the items array with subTotal, total, taxTotal
        items.forEach((item) => {
            const itemTotal = calculate.multiply(item.quantity, item.price);
            // sub total
            subTotal = calculate.add(subTotal, itemTotal);
            // item total
            item.total = itemTotal;
        });
        taxTotal = calculate.multiply(subTotal, taxRate / 100);
        total = calculate.add(subTotal, taxTotal);
        const body = Object.assign(Object.assign({}, req.body), { subTotal,
            taxTotal,
            total,
            items, createdBy: req.admin._id });
        // Creating a new document in the collection
        const result = yield new QuoteModel(body).save();
        const fileId = `quote-${result._id}.pdf`;
        const updateResult = yield QuoteModel.findOneAndUpdate({ _id: result._id }, { pdf: fileId }, { new: true }).exec();
        // Returning successful response
        increaseBySettingKey({
            settingKey: 'last_quote_number',
        });
        // Returning successful response
        return res.status(200).json({
            success: true,
            result: updateResult,
            message: 'Quote created successfully',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Internal Server Error',
        });
    }
});
export default create;
