import mongoose, { Schema, Document } from 'mongoose';

interface IQuote extends Document {
  removed: boolean;
  createdBy: mongoose.Types.ObjectId;
  converted: boolean;
  number: number;
  year: number;
  content?: string;
  date: Date;
  expiredDate: Date;
  client: mongoose.Types.ObjectId;
  items: {
    itemName: string;
    description?: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  taxRate?: number;
  subTotal?: number;
  taxTotal?: number;
  total?: number;
  credit: number;
  currency: string;
  discount: number;
  notes?: string;
  status: 'draft' | 'pending' | 'sent' | 'accepted' | 'declined' | 'cancelled' | 'on hold';
  approved: boolean;
  isExpired: boolean;
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

const quoteSchema: Schema<IQuote> = new Schema<IQuote>({
  removed: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  converted: {
    type: Boolean,
    default: false,
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
  items: [
    {
      itemName: {
        type: String,
        required: true,
      },
      description: String,
      quantity: {
        type: Number,
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
  taxRate: Number,
  subTotal: Number,
  taxTotal: Number,
  total: Number,
  credit: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    uppercase: true,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  notes: String,
  status: {
    type: String,
    enum: ['draft', 'pending', 'sent', 'accepted', 'declined', 'cancelled', 'on hold'],
    default: 'draft',
  },
  approved: {
    type: Boolean,
    default: false,
  },
  isExpired: {
    type: Boolean,
    default: false,
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

quoteSchema.plugin(require('mongoose-autopopulate'));
export default mongoose.model<IQuote>('Quote', quoteSchema);
