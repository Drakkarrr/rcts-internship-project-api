import mongoose, { Schema, Document } from 'mongoose';

interface IProductCategory extends Document {
  removed: boolean;
  enabled: boolean;
  name: string;
  description?: string;
  color: string;
  hasParentCategory: boolean;
  parentCategory?: mongoose.Types.ObjectId;
  title?: string;
  tags?: string[];
  icon?: string;
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
  created: Date;
  updated: Date;
  isPublic: boolean;
}

const productCategorySchema: Schema<IProductCategory> = new Schema<IProductCategory>({
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
  description: String,
  color: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  hasParentCategory: {
    type: Boolean,
    default: false,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
  },
  title: String,
  tags: [String],
  icon: String,
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

export default mongoose.model<IProductCategory>('ProductCategory', productCategorySchema);
