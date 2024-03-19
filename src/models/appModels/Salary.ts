import mongoose, { Schema, Document } from 'mongoose';

interface ISalary extends Document {
  removed: boolean;
  createdBy: mongoose.Types.ObjectId;
  number: number;
  recurring: 'weekly' | 'monthly' | 'annually' | 'quarter';
  date: Date;
  employee: mongoose.Types.ObjectId;
  month: number;
  year: number;
  currency: string;
  basicSalary: number;
  deduction: number;
  allowance: number;
  overtime: number;
  total: number;
  payment: mongoose.Types.ObjectId[];
  paymentStatus: 'unpaid' | 'paid' | 'partially';
  approved: boolean;
  notes?: string;
  status: 'draft' | 'pending' | 'completed' | 'processing' | 'on hold';
  pdf?: string;
  files?: {
    id: string;
    name: string;
    path: string;
    description?: string;
    isPublic: boolean;
  }[];
  updated: Date;
  created: Date;
}

const salarySchema: Schema<ISalary> = new Schema<ISalary>({
  removed: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  recurring: {
    type: String,
    enum: ['weekly', 'monthly', 'annually', 'quarter'],
  },
  date: {
    type: Date,
    required: true,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    autopopulate: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    uppercase: true,
    required: true,
  },
  basicSalary: {
    type: Number,
    required: true,
  },
  deduction: {
    type: Number,
    default: 0,
  },
  allowance: {
    type: Number,
    default: 0,
  },
  overtime: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  payment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SalaryPayment',
    },
  ],
  paymentStatus: {
    type: String,
    default: 'unpaid',
    enum: ['unpaid', 'paid', 'partially'],
  },
  approved: {
    type: Boolean,
    default: false,
  },
  notes: String,
  status: {
    type: String,
    enum: ['draft', 'pending', 'completed', 'processing', 'on hold'],
    default: 'draft',
  },
  pdf: String,
  files: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: true,
      },
    },
  ],
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

salarySchema.plugin(require('mongoose-autopopulate'));
export default mongoose.model<ISalary>('Salary', salarySchema);
