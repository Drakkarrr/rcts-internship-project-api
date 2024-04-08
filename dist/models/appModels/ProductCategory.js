import mongoose, { Schema } from 'mongoose';
const productCategorySchema = new Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: String,
    color: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
    },
    hasParentCategory: {
        type: Boolean,
        default: false,
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategory',
    },
    title: String,
    tags: [String],
    icon: String,
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
export default mongoose.model('ProductCategory', productCategorySchema);
//# sourceMappingURL=ProductCategory.js.map