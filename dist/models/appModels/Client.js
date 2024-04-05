import mongoose, { Schema } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
var ClientType;
(function (ClientType) {
    ClientType["Company"] = "company";
    ClientType["People"] = "people";
})(ClientType || (ClientType = {}));
const clientSchema = new Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    type: {
        type: String,
        default: ClientType.Company,
        enum: Object.values(ClientType),
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', autopopulate: true },
    people: { type: mongoose.Schema.Types.ObjectId, ref: 'People', autopopulate: true },
    convertedFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
    interestedIn: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    assigned: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    source: String,
    category: String,
    created: {
        type: Date,
        default: Date.now,
    },
    updated: {
        type: Date,
        default: Date.now,
    },
});
clientSchema.plugin(autopopulate);
export default mongoose.model('Client', clientSchema);
