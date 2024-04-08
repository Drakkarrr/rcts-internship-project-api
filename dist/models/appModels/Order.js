import mongoose, { Schema } from 'mongoose';
const orderSchema = new Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    assigned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    },
    number: {
        type: Number,
        required: true,
    },
    recurring: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'annually', 'quarter'],
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
        autopopulate: true,
    },
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
        autopopulate: true,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            itemName: {
                type: String,
                required: true,
            },
            description: String,
            quantity: {
                type: Number,
                default: 1,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            discount: {
                type: Number,
                default: 0,
            },
            total: {
                type: Number,
            },
            notes: String,
        },
    ],
    shipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipment',
    },
    approved: {
        type: Boolean,
        default: false,
    },
    notes: String,
    fulfillment: {
        type: String,
        enum: ['pending', 'in review', 'processing', 'packing', 'shipped', 'on hold', 'cancelled'],
        default: 'pending',
    },
    status: {
        type: String,
        enum: [
            'not started',
            'in progress',
            'delayed',
            'completed',
            'delivered',
            'returned',
            'cancelled',
            'on hold',
            'refunded',
        ],
        default: 'not started',
    },
    processingStatus: String,
    pdf: String,
    updated: {
        type: Date,
        default: Date.now,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});
orderSchema.plugin(require('mongoose-autopopulate'));
export default mongoose.model('Order', orderSchema);
//# sourceMappingURL=Order.js.map