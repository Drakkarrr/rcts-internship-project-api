import mongoose, { Schema } from 'mongoose';
const adminSchema = new Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    enabled: {
        type: Boolean,
        default: false,
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
    },
    name: { type: String, required: true },
    surname: { type: String },
    photo: {
        type: String,
        trim: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        default: 'employee',
        enum: ['owner', 'admin', 'manager', 'employee', 'create_only', 'read_only'],
    },
});
export default mongoose.model('Admin', adminSchema);
