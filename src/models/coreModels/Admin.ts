import mongoose, { Schema, Document } from 'mongoose';

interface IAdmin extends Document {
  removed: boolean;
  enabled: boolean;
  email: string;
  name: string;
  surname?: string;
  photo?: string;
  created: Date;
  role: 'owner' | 'admin' | 'manager' | 'employee' | 'create_only' | 'read_only';
}

const adminSchema: Schema<IAdmin> = new Schema<IAdmin>({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  name: { type: String, required: true },
  surname: { type: String },
  photo: {
    type: String,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: 'employee',
    enum: ['owner', 'admin', 'manager', 'employee', 'create_only', 'read_only'],
  },
});

export default mongoose.model<IAdmin>('Admin', adminSchema);
