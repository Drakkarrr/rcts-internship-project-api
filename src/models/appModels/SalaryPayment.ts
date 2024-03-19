import mongoose, { Schema, Document } from 'mongoose';

interface ISalaryPayment extends Document {
  removed: boolean;
  createdBy: mongoose.Types.ObjectId;
  employee: mongoose.Types.ObjectId;
  salary: mongoose.Types.ObjectId;
  date: Date;
  amount: number;
  paymentMode?: mongoose.Types.ObjectId;
  ref?: string;
  receipt?: string;
  description?: string;
  updated: Date;
  created: Date;
}

const salaryPaymentSchema: Schema<ISalaryPayment> = new Schema<ISalaryPayment>({
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
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    autopopulate: true,
    required: true,
  },
  salary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salary',
    autopopulate: true,
    required: true,
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
  paymentMode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMode',
    autopopulate: true,
  },
  ref: String,
  receipt: String,
  description: String,
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

salaryPaymentSchema.plugin(require('mongoose-autopopulate'));
export default mongoose.model<ISalaryPayment>('SalaryPayment', salaryPaymentSchema);
