import mongoose, { Schema } from 'mongoose';
const productSchema = new Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    productCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategory',
        required: true,
        autopopulate: true,
    },
    suppliers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }],
    name: {
        type: String,
        required: true,
    },
    description: String,
    number: Number,
    title: String,
    tags: [String],
    headerImage: String,
    photo: String,
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
    priceBeforeTax: Number,
    taxRate: { type: Number, default: 0 },
    price: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        uppercase: true,
        required: true,
    },
    customField: [
        {
            fieldName: {
                type: String,
                trim: true,
                lowercase: true,
            },
            fieldType: {
                type: String,
                trim: true,
                lowercase: true,
                default: 'string',
            },
            fieldValue: {},
        },
    ],
    created: {
        type: Date,
        default: Date.now,
    },
    updated: {
        type: Date,
        default: Date.now,
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
});
productSchema.plugin(require('mongoose-autopopulate'));
export default mongoose.model('Product', productSchema);
