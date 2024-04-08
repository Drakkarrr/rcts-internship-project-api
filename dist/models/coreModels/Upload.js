import mongoose, { Schema } from 'mongoose';
var FileType;
(function (FileType) {
    FileType["JPEG"] = "jpeg";
    FileType["JPG"] = "jpg";
    FileType["PNG"] = "png";
    FileType["GIF"] = "gif";
    FileType["WEBP"] = "webp";
    FileType["DOC"] = "doc";
    FileType["TXT"] = "txt";
    FileType["CSV"] = "csv";
    FileType["DOCX"] = "docx";
    FileType["XLS"] = "xls";
    FileType["XLSX"] = "xlsx";
    FileType["PDF"] = "pdf";
    FileType["ZIP"] = "zip";
    FileType["RAR"] = "rar";
    FileType["MP4"] = "mp4";
    FileType["MOV"] = "mov";
    FileType["AVI"] = "avi";
    FileType["MP3"] = "mp3";
    FileType["M4A"] = "m4a";
    FileType["WEBM"] = "webm";
})(FileType || (FileType = {}));
const uploadSchema = new Schema({
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
export default mongoose.model('Upload', uploadSchema);
//# sourceMappingURL=Upload.js.map