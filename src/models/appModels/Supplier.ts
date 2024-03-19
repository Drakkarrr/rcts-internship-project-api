import mongoose, { Schema, Document, Types } from 'mongoose';

interface CustomField {
  fieldName: string;
  fieldType: string;
  fieldValue: any;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
  youtube?: string;
  snapchat?: string;
}

interface Supplier extends Document {
  removed: boolean;
  enabled: boolean;
  name: string;
  legalName: string;
  hasParentSupplier: boolean;
  parentSupplier?: Types.ObjectId | Supplier;
  peoples?: Types.ObjectId[] | any;
  mainContact?: Types.ObjectId | any;
  products?: Types.ObjectId[] | any;
  icon?: string;
  logo?: string;
  bankName?: string;
  bankIban?: string;
  bankSwift?: string;
  bankNumber?: string;
  bankRouting?: string;
  bankCountry?: string;
  companyRegNumber?: string;
  companyTaxNumber?: string;
  companyTaxId?: string;
  companyRegId?: string;
  securitySocialNbr?: string;
  customField: CustomField[];
  location?: Location;
  address?: string;
  city?: string;
  State?: string;
  postalCode?: number;
  country?: string;
  phone?: string;
  otherPhone?: string[];
  fax?: string;
  email?: string;
  otherEmail?: string[];
  socialMedia?: SocialMedia;
  website?: string;
  images: {
    id: string;
    name: string;
    path: string;
    description: string;
    isPublic: boolean;
  }[];
  files: {
    id: string;
    name: string;
    path: string;
    description: string;
    isPublic: boolean;
  }[];
  category?: string;
  tags?: string[];
  created: Date;
  updated: Date;
  isPublic: boolean;
}

const supplierSchema: Schema<Supplier> = new Schema<Supplier>({
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
    trim: true,
    required: true,
  },
  legalName: {
    type: String,
    trim: true,
    required: true,
  },
  hasParentSupplier: {
    type: Boolean,
    default: false,
  },
  parentSupplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
  },
  peoples: [{ type: mongoose.Schema.Types.ObjectId, ref: 'People' }],
  mainContact: { type: mongoose.Schema.Types.ObjectId, ref: 'People' },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  icon: {
    type: String,
    trim: true,
  },
  logo: {
    type: String,
    trim: true,
  },
  bankName: {
    type: String,
    trim: true,
  },
  bankIban: {
    type: String,
    trim: true,
  },
  bankSwift: {
    type: String,
    trim: true,
  },
  bankNumber: {
    type: String,
    trim: true,
  },
  bankRouting: {
    type: String,
    trim: true,
  },
  bankCountry: {
    type: String,
    trim: true,
  },
  companyRegNumber: {
    type: String,
    trim: true,
  },
  companyTaxNumber: {
    type: String,
    trim: true,
  },
  companyTaxId: {
    type: String,
    trim: true,
  },
  companyRegId: {
    type: String,
    trim: true,
  },
  securitySocialNbr: String,
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
  location: {
    latitude: Number,
    longitude: Number,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  State: {
    type: String,
  },
  postalCode: {
    type: Number,
  },
  country: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  otherPhone: [
    {
      type: String,
      trim: true,
    },
  ],
  fax: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  otherEmail: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    tiktok: String,
    youtube: String,
    snapchat: String,
  },
  website: {
    type: String,
    trim: true,
    lowercase: true,
  },
  images: [
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
  category: String,
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
  isPublic: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<Supplier>('Supplier', supplierSchema);
