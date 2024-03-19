import mongoose, { Schema, Document } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

enum ClientType {
  Company = 'company',
  People = 'people',
}

interface IClient extends Document {
  removed: boolean;
  enabled: boolean;
  type: ClientType;
  name: string;
  company?: mongoose.Types.ObjectId;
  people?: mongoose.Types.ObjectId;
  convertedFrom?: mongoose.Types.ObjectId;
  interestedIn: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  assigned: mongoose.Types.ObjectId;
  source?: string;
  category?: string;
  created: Date;
  updated: Date;
}

const clientSchema: Schema<IClient> = new Schema<IClient>({
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

export default mongoose.model<IClient>('Client', clientSchema);
