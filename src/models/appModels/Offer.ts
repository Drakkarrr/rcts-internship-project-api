import mongoose, { Schema, Document } from 'mongoose';

interface IOffer extends Document {
  removed: boolean;
  createdBy: mongoose.Types.ObjectId;
  converted: boolean;
  number: number;
  year: number;
  content?: string;
  date: Date;
  lead: mongoose.Types.ObjectId;
  items: {
    itemName: string;
    description?: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  currency: string;
  taxRate?: number;
  subTotal?: number;
  subOfferTotal?: number;
  taxTotal?: number;
  total?: number;
  discount: number;
  notes?: string;
  status: 'draft' | 'pending' | 'sent' | 'accepted' | 'declined' | 'cancelled' | 'on hold';
  approved: boolean;
  isExpired: boolean;
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

const offerSchema: Schema<IOffer> = new Schema<IOffer>({
  removed: {
    type: Boolean,
    default: false,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
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
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true,
    autopopulate: true,
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
  currency: {
    type: String,
    uppercase: true,
    required: true,
  },
  taxRate: {
    type: Number,
  },
  subTotal: {
    type: Number,
  },
  subOfferTotal: {
    type: Number,
  },
  taxTotal: {
    type: Number,
  },
  total: {
    type: Number,
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

offerSchema.plugin(require('mongoose-autopopulate'));
export default mongoose.model<IOffer>('Offer', offerSchema);
