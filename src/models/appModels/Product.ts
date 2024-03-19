import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
  removed: boolean;
  enabled: boolean;
  productCategory: mongoose.Types.ObjectId;
  suppliers: mongoose.Types.ObjectId[];
  name: string;
  description?: string;
  number?: number;
  title?: string;
  tags?: string[];
  headerImage?: string;
  photo?: string;
  images?: {
    id: string;
    name: string;
    path: string;
    description?: string;
    isPublic: boolean;
  }[];
  files?: {
    id: string;
    name: string;
    path: string;
    description?: string;
    isPublic: boolean;
  }[];
  priceBeforeTax?: number;
  taxRate: number;
  price: number;
  currency: string;
  customField?: {
    fieldName: string;
    fieldType: string;
    fieldValue: any;
  }[];
  created: Date;
  updated: Date;
  isPublic: boolean;
}

const productSchema: Schema<IProduct> = new Schema<IProduct>({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  productCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
    required: true,
    autopopulate: true,
  },
  suppliers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }],
  name: {
    type: String,
    required: true,
  },
  description: String,
  number: Number,
  title: String,
  tags: [String],
  headerImage: String,
  photo: String,
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
  priceBeforeTax: Number,
  taxRate: { type: Number, default: 0 },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    uppercase: true,
    required: true,
  },
  customField: [
    {
      fieldName: {
        type: String,
        trim: true,
        lowercase: true,
      },
      fieldType: {
        type: String,
        trim: true,
        lowercase: true,
        default: 'string',
      },
      fieldValue: {},
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
  isPublic: {
    type: Boolean,
    default: true,
  },
});

productSchema.plugin(require('mongoose-autopopulate'));
export default mongoose.model<IProduct>('Product', productSchema);
