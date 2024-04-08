import mongoose from 'mongoose';
import { calculate } from '@/helpers';
const Model = mongoose.model('Quote');
const update = async (req, res) => {
    const { items = [], taxRate = 0, discount = 0 } = req.body;
    if (items.length === 0) {
        return res.status(400).json({
            success: false,
            result: null,
            message: 'Items cannot be empty',
        });
    }
    let subTotal = 0;
    let taxTotal = 0;
    let total = 0;
    items.forEach((item) => {
        const itemTotal = calculate.multiply(item.quantity, item.price);
        subTotal = calculate.add(subTotal, itemTotal);
        item.total = itemTotal;
    });
    taxTotal = calculate.multiply(subTotal, taxRate / 100);
    total = calculate.add(subTotal, taxTotal);
    const updatedBody = {
        subTotal,
        taxTotal,
        total,
        items,
        pdf: `quote-${req.params.id}.pdf`,
    };
    if (updatedBody.currency) {
        delete updatedBody.currency;
    }
    const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, updatedBody, {
        new: true, // return the new result instead of the old one
    }).exec();
    return res.status(200).json({
        success: true,
        result,
        message: 'Document updated successfully',
    });
};
export default update;
