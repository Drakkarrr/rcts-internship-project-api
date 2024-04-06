import mongoose, { Schema } from 'mongoose';
const expenseCategorySchema = new Schema({
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
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    color: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
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
export default mongoose.model('ExpenseCategory', expenseCategorySchema);