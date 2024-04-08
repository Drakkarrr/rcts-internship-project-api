import mongoose, { Schema } from 'mongoose';
const taxesSchema = new Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    taxName: {
        type: String,
        required: true,
    },
    taxValue: {
        type: Number,
        required: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});
export default mongoose.model('Taxes', taxesSchema);
//# sourceMappingURL=Taxes.js.map