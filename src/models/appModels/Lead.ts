import mongoose, { Schema, Document } from 'mongoose';

interface ILead extends Document {
  removed: boolean;
  enabled: boolean;
  type: 'company' | 'people';
  name: string;
  company?: mongoose.Types.ObjectId;
  people?: mongoose.Types.ObjectId;
  interestedIn?: mongoose.Types.ObjectId[];
  offer?: mongoose.Types.ObjectId[];
  converted: boolean;
  createdBy?: mongoose.Types.ObjectId;
  assigned?: mongoose.Types.ObjectId;
  subTotal?: number;
  taxTotal?: number;
  total?: number;
  discount?: number;
  images: {
    id: string;
    name: string;
    path: string;
    description?: string;
    isPublic: boolean;
  }[];
  files: {
    id: string;
    name: string;
    path: string;
    description?: string;
    isPublic: boolean;
  }[];
  category?: string;
  status?: string;
  notes?: string;
  source?: string;
  approved: boolean;
  tags: string[];
  created: Date;
  updated: Date;
}

const leadSchema: Schema<ILead> = new Schema<ILead>({
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
    default: 'company',
    enum: ['company', 'people'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', autopopulate: true },
  people: { type: mongoose.Schema.Types.ObjectId, ref: 'People', autopopulate: true },
  interestedIn: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  offer: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Offer' }],
  converted: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  assigned: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  subTotal: {
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
  },
  images: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: false,
      },
    },
  ],
  files: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: false,
      },
    },
  ],
  category: String,
  status: String,
  notes: String,
  source: String,
  approved: {
    type: Boolean,
    default: false,
  },
  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

leadSchema.plugin(require('mongoose-autopopulate'));
export default mongoose.model<ILead>('Lead', leadSchema);
