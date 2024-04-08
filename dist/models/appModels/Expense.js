import mongoose, { Schema } from 'mongoose';
const schema = new Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    name: {
        type: String,
        trim: true,
        required: true,
    },
    description: String,
    ref: {
        type: String,
        trim: true,
    },
    recurring: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'annually', 'quarter'],
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        autopopulate: true,
    },
    expenseCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExpenseCategory',
        autopopulate: true,
        required: true,
    },
    taxRate: Number,
    subTotal: Number,
    taxTotal: Number,
    total: Number,
    currency: {
        type: String,
        uppercase: true,
        required: true,
    },
    paymentMode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentMode',
        autopopulate: true,
    },
    receipt: String,
    images: [
        {
            id: String,
            name: String,
            path: String,
            description: String,
            isPublic: {
                type: Boolean,
                default: false,
            },
        },
    ],
    files: [
        {
            id: String,
            name: String,
            path: String,
            description: String,
            isPublic: {
                type: Boolean,
                default: false,
            },
        },
    ],
    updated: {
        type: Date,
        default: Date.now,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});
schema.plugin(require('mongoose-autopopulate'));
export default mongoose.model('Expense', schema);
//# sourceMappingURL=Expense.js.map