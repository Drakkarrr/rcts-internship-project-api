import mongoose, { Schema, Document } from 'mongoose';

enum FileType {
  JPEG = 'jpeg',
  JPG = 'jpg',
  PNG = 'png',
  GIF = 'gif',
  WEBP = 'webp',
  DOC = 'doc',
  TXT = 'txt',
  CSV = 'csv',
  DOCX = 'docx',
  XLS = 'xls',
  XLSX = 'xlsx',
  PDF = 'pdf',
  ZIP = 'zip',
  RAR = 'rar',
  MP4 = 'mp4',
  MOV = 'mov',
  AVI = 'avi',
  MP3 = 'mp3',
  M4A = 'm4a',
  WEBM = 'webm',
}

interface IUpload extends Document {
  removed: boolean;
  enabled: boolean;
  modelName?: string;
  fieldId: string;
  fileName: string;
  fileType: FileType;
  isPublic: boolean;
  userID: mongoose.Types.ObjectId;
  isSecure: boolean;
  path: string;
  created: Date;
}

const uploadSchema: Schema<IUpload> = new Schema<IUpload>({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  modelName: {
    type: String,
    trim: true,
  },
  fieldId: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: Object.values(FileType),
    required: true,
  },
  isPublic: {
    type: Boolean,
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  isSecure: {
    type: Boolean,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IUpload>('Upload', uploadSchema);
