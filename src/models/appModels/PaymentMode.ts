import mongoose, { Schema, Document } from 'mongoose';

interface IPaymentMode extends Document {
  removed: boolean;
  enabled: boolean;
  name: string;
  description: string;
  ref?: string;
  isDefault: boolean;
  created: Date;
}

const paymentModeSchema: Schema<IPaymentMode> = new Schema<IPaymentMode>({
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

export default mongoose.model<IPaymentMode>('PaymentMode', paymentModeSchema);
