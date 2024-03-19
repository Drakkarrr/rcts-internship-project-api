import mongoose, { Schema, Document } from 'mongoose';

interface IExpenseCategory extends Document {
  removed: boolean;
  enabled: boolean;
  name: string;
  description: string;
  color: string;
  created: Date;
  updated: Date;
}

const expenseCategorySchema: Schema<IExpenseCategory> = new Schema<IExpenseCategory>({
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
  description: {
    type: String,
    trim: true,
    required: true,
  },
  color: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IExpenseCategory>('ExpenseCategory', expenseCategorySchema);
