import mongoose, { Schema, Document } from 'mongoose';

interface IPayment extends Document {
  removed: boolean;
  createdBy: mongoose.Types.ObjectId;
  number: number;
  client: mongoose.Types.ObjectId;
  invoice: mongoose.Types.ObjectId;
  date: Date;
  amount: number;
  currency: string;
  paymentMode?: mongoose.Types.ObjectId;
  ref?: string;
  description?: string;
  updated: Date;
  created: Date;
}

const paymentSchema: Schema<IPayment> = new Schema<IPayment>({
  removed: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    autopopulate: true,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    autopopulate: true,
    required: true,
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true,
    autopopulate: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    uppercase: true,
    required: true,
  },
  paymentMode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMode',
    autopopulate: true,
  },
  ref: {
    type: String,
  },
  description: {
    type: String,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

paymentSchema.plugin(require('mongoose-autopopulate'));

export default mongoose.model<IPayment>('Payment', paymentSchema);
