import mongoose, { Schema } from 'mongoose';
const emailSchema = new Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    emailKey: {
        type: String,
        lowercase: true,
        required: true,
    },
    emailName: {
        type: String,
        required: true,
    },
    emailVariables: {
        type: [String],
    },
    emailBody: {
        type: String,
        required: true,
    },
    emailSubject: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        default: 'us_en',
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
export default mongoose.model('Email', emailSchema);
//# sourceMappingURL=Email.js.map