import mongoose, { Schema } from 'mongoose';
const shipmentSchema = new Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    assigned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    },
    carrier: {
        type: String,
        required: true,
    },
    trackingNumber: String,
    trackingLink: String,
    date: {
        type: Date,
        required: true,
    },
    estimatedDeliveryDate: {
        type: Date,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
    },
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
    },
    recipient: {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: String,
        country: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        phone: String,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: String,
                required: true,
            },
        },
    ],
    approved: {
        type: Boolean,
        default: false,
    },
    notes: String,
    status: {
        type: String,
        enum: [
            'pending',
            'confirmed',
            'in transit',
            'out for delivery',
            'delivered',
            'returned',
            'failed',
            'cancelled',
        ],
        default: 'pending',
    },
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
shipmentSchema.plugin(require('mongoose-autopopulate'));
export default mongoose.model('Shipment', shipmentSchema);
