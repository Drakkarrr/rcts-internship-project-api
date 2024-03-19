import mongoose, { Schema, Document } from 'mongoose';

interface Taxes extends Document {
  removed: boolean;
  enabled: boolean;
  taxName: string;
  taxValue: number;
  isDefault: boolean;
  created: Date;
}

const taxesSchema: Schema<Taxes> = new Schema<Taxes>({
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

export default mongoose.model<Taxes>('Taxes', taxesSchema);
