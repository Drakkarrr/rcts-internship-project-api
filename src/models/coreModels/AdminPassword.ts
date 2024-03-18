import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IAdminPassword extends Document {
  removed: boolean;
  user: mongoose.Schema.Types.ObjectId;
  password: string;
  salt: string;
  emailToken?: string;
  resetToken?: string;
  emailVerified: boolean;
  authType: string;
  loggedSessions: string[];
}

const AdminPasswordSchema: Schema<IAdminPassword> = new Schema<IAdminPassword>({
  removed: {
    type: Boolean,
    default: false,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true, unique: true },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  emailToken: String,
  resetToken: String,
  emailVerified: {
    type: Boolean,
    default: false,
  },
  authType: {
    type: String,
    default: 'email',
  },
  loggedSessions: {
    type: [String],
    default: [],
  },
});

// AdminPasswordSchema.index({ user: 1 });

// generating a hash
AdminPasswordSchema.methods.generateHash = function (salt: string, password: string): string {
  return bcrypt.hashSync(salt + password);
};

// checking if password is valid
AdminPasswordSchema.methods.validPassword = function (salt: string, userpassword: string): boolean {
  return bcrypt.compareSync(salt + userpassword, this.password);
};

export default mongoose.model<IAdminPassword>('AdminPassword', AdminPasswordSchema);
