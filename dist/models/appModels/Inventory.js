import mongoose, { Schema } from 'mongoose';
const adjustmentSchema = new Schema({
    increase: {
        returned: {
            type: Number,
            default: 0,
        },
        change: {
            type: Number,
            default: 0,
        },
        refund: {
            type: Number,
            default: 0,
        },
        other: {
            type: Number,
            default: 0,
        },
    },
    decrease: {
        damaged: {
            type: Number,
            default: 0,
        },
        change: {
            type: Number,
            default: 0,
        },
        refund: {
            type: Number,
            default: 0,
        },
        other: {
            type: Number,
            default: 0,
        },
    },
});
const inventorySchema = new Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: {
        type: Number,
        default: 0,
    },
    threshold: {
        type: Number,
        default: 0,
    },
    order: {
        type: Number,
        default: 0,
    },
    purchase: {
        type: Number,
        default: 0,
    },
    adjustment: adjustmentSchema,
    created: {
        type: Date,
        default: Date.now,
    },
    updated: {
        type: Date,
        default: Date.now,
    },
});
export default mongoose.model('Inventory', inventorySchema);
//# sourceMappingURL=Inventory.js.map