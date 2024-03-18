import mongoose, { Schema, Document } from 'mongoose';

interface IEmail extends Document {
  removed: boolean;
  enabled: boolean;
  emailKey: string;
  emailName: string;
  emailVariables?: string[];
  emailBody: string;
  emailSubject: string;
  language: string;
  created: Date;
  updated: Date;
}

const emailSchema: Schema<IEmail> = new Schema<IEmail>({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  emailKey: {
    type: String,
    lowercase: true,
    required: true,
  },
  emailName: {
    type: String,
    required: true,
  },
  emailVariables: {
    type: [String],
  },
  emailBody: {
    type: String,
    required: true,
  },
  emailSubject: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: 'us_en',
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

export default mongoose.model<IEmail>('Email', emailSchema);
