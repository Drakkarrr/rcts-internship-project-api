import mongoose, { Schema } from 'mongoose';
const surveySchema = new Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    result: [
        {
            question: String,
            answer: String,
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
});
surveySchema.plugin(require('mongoose-autopopulate'));
export default mongoose.model('Survey', surveySchema);
