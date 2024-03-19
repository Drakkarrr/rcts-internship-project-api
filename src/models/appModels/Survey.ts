import mongoose, { Schema, Document, Types } from 'mongoose';

interface SurveyResult {
  question: string;
  answer: string;
}

interface Survey extends Document {
  removed: boolean;
  enabled: boolean;
  user?: Types.ObjectId | 'Admin' | any;
  result: SurveyResult[];
  created: Date;
  updated: Date;
}

const surveySchema: Schema<Survey> = new Schema<Survey>({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  result: [
    {
      question: String,
      answer: String,
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

surveySchema.plugin(require('mongoose-autopopulate'));
export default mongoose.model<Survey>('Survey', surveySchema);
