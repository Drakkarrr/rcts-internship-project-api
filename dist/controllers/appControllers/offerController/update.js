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
const Model = mongoose.model('Offer');
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
        // Calculate the items array with subTotal, total, taxTotal
        items.forEach((item) => {
            const itemTotal = calculate.multiply(item['quantity'], item['price']);
            // Sub total
            subTotal = calculate.add(subTotal, itemTotal);
            // Item total
            item['total'] = itemTotal;
        });
        taxTotal = calculate.multiply(subTotal, taxRate / 100);
        total = calculate.add(subTotal, taxTotal);
        let body = req.body;
        body['subTotal'] = subTotal;
        body['taxTotal'] = taxTotal;
        body['total'] = total;
        body['items'] = items;
        body['pdf'] = 'offer-' + req.params.id + '.pdf';
        if (body.hasOwnProperty('currency')) {
            delete body.currency;
        }
        // Find document by id and updates with the required fields
        const result = yield Model.findOneAndUpdate({ _id: req.params.id, removed: false }, body, {
            new: true, // return the new result instead of the old one
        }).exec();
        // Returning successful response
        return res.status(200).json({
            success: true,
            result,
            message: 'Document updated successfully',
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
export default update;
