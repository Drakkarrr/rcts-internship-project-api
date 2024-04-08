import mongoose, { Schema } from 'mongoose';
const paymentModeSchema = new Schema({
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
    description: {
        type: String,
        required: true,
    },
    ref: {
        type: String,
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
export default mongoose.model('PaymentMode', paymentModeSchema);
