import mongoose, { Schema, Document } from 'mongoose';

interface IPurchase extends Document {
  removed: boolean;
  createdBy: mongoose.Types.ObjectId;
  number: number;
  year: number;
  content?: string;
  recurring?: 'daily' | 'weekly' | 'monthly' | 'annually' | 'quarter';
  date: Date;
  expiredDate: Date;
  supplier: mongoose.Types.ObjectId;
  items: {
    product?: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    taxRate?: number;
    subTotal?: number;
    taxTotal?: number;
    total: number;
  }[];
  currency: string;
  taxRate: number;
  subTotal: number;
  taxTotal: number;
  total: number;
  credit: number;
  discount: number;
  expense?: mongoose.Types.ObjectId[];
  paymentStatus: 'unpaid' | 'paid' | 'partially';
  isOverdue: boolean;
  approved: boolean;
  notes?: string;
  status: 'draft' | 'pending' | 'ordred' | 'received' | 'refunded' | 'cancelled' | 'on hold';
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

const purchaseSchema: Schema<IPurchase> = new Schema<IPurchase>({
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
  year: {
    type: Number,
    required: true,
  },
  content: String,
  recurring: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'annually', 'quarter'],
  },
  date: {
    type: Date,
    required: true,
  },
  expiredDate: {
    type: Date,
    required: true,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true,
    autopopulate: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      taxRate: {
        type: Number,
        default: 0,
      },
      subTotal: {
        type: Number,
        default: 0,
      },
      taxTotal: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
    },
  ],
  currency: {
    type: String,
    uppercase: true,
    required: true,
  },
  taxRate: {
    type: Number,
    default: 0,
  },
  subTotal: {
    type: Number,
    default: 0,
  },
  taxTotal: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  credit: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  expense: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expense',
    },
  ],
  paymentStatus: {
    type: String,
    default: 'unpaid',
    enum: ['unpaid', 'paid', 'partially'],
  },
  isOverdue: {
    type: Boolean,
    default: false,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  notes: String,
  status: {
    type: String,
    enum: ['draft', 'pending', 'ordred', 'received', 'refunded', 'cancelled', 'on hold'],
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

purchaseSchema.plugin(require('mongoose-autopopulate'));
export default mongoose.model<IPurchase>('Purchase', purchaseSchema);
