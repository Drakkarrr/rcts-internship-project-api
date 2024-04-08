import mongoose, { Schema } from 'mongoose';
const schema = new Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    hasOrder: {
        type: Boolean,
        default: false,
    },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    adjustmentType: {
        type: String,
        enum: ['increase', 'decrease'],
    },
    reasonType: {
        type: String,
        enum: ['returned', 'damaged', 'change', 'refund', 'other'],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    updated: {
        type: Date,
        default: Date.now,
    },
});
export default mongoose.model('InventoryAdjustment', schema);
//# sourceMappingURL=InventoryAdjustment.js.map