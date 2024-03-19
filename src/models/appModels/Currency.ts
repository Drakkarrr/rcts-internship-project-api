import mongoose, { Schema, Document } from 'mongoose';

interface ICurrency extends Document {
  removed: boolean;
  enabled: boolean;
  currency_name: string;
  color?: string;
  currency_code: string;
  currency_symbol: string;
  currency_position: 'before' | 'after';
  decimal_sep: string;
  thousand_sep: string;
  cent_precision: number;
  zero_format: boolean;
  isDefault: boolean;
  created: Date;
}

const currencySchema: Schema<ICurrency> = new Schema<ICurrency>({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  currency_name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    lowercase: true,
  },
  currency_code: {
    type: String,
    uppercase: true,
    required: true,
    maxLength: 3,
  },
  currency_symbol: {
    type: String,
    required: true,
  },
  currency_position: {
    type: String,
    required: true,
    default: 'before',
    enum: ['after', 'before'],
  },
  decimal_sep: {
    type: String,
    required: true,
    default: '.',
  },
  thousand_sep: {
    type: String,
    required: true,
    default: ' ',
  },
  cent_precision: {
    type: Number,
    required: true,
    default: 2,
  },
  zero_format: {
    type: Boolean,
    required: true,
    default: false,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICurrency>('Currency', currencySchema);
