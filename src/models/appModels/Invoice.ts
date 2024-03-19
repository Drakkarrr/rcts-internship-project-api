import mongoose, { Schema, Document } from 'mongoose';

interface IInvoiceItem extends Document {
  itemName: string;
  description?: string;
  quantity: number;
  price: number;
  total: number;
}

interface IInvoice extends Document {
  removed: boolean;
  createdBy: mongoose.Types.ObjectId;
  number: number;
  year: number;
  content?: string;
  recurring?: 'daily' | 'weekly' | 'monthly' | 'annually' | 'quarter';
  date: Date;
  expiredDate: Date;
  client: mongoose.Types.ObjectId;
  converted: {
    from?: 'quote' | 'offer';
    offer?: mongoose.Types.ObjectId;
    quote?: mongoose.Types.ObjectId;
  };
  items: IInvoiceItem[];
  taxRate: number;
  subTotal: number;
  taxTotal: number;
  total: number;
  currency: string;
  credit: number;
  discount: number;
  payment: mongoose.Types.ObjectId[];
  paymentStatus: 'unpaid' | 'paid' | 'partially';
  isOverdue: boolean;
  approved: boolean;
  notes?: string;
  status: 'draft' | 'pending' | 'sent' | 'refunded' | 'cancelled' | 'on hold';
  pdf?: string;
  files: {
    id: string;
    name: string;
    path: string;
    description?: string;
    isPublic: boolean;
  }[];
  updated: Date;
  created: Date;
}

const invoiceSchema: Schema<IInvoice> = new Schema<IInvoice>({
  removed: {
    type: Boolean,
    default: false,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
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
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
    autopopulate: true,
  },
  converted: {
    from: {
      type: String,
      enum: ['quote', 'offer'],
    },
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
    },
    quote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quote',
    },
  },
  items: [
    {
      itemName: {
        type: String,
        required: true,
      },
      description: {
        type: String,
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
      total: {
        type: Number,
        required: true,
      },
    },
  ],
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
  currency: {
    type: String,
    uppercase: true,
    required: true,
  },
  credit: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  payment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
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
  notes: {
    type: String,
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'sent', 'refunded', 'cancelled', 'on hold'],
    default: 'draft',
  },
  pdf: {
    type: String,
  },
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

invoiceSchema.plugin(require('mongoose-autopopulate'));
export default mongoose.model<IInvoice>('Invoice', invoiceSchema);
