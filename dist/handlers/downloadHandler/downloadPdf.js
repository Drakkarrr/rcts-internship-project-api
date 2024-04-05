var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import custom from '@/controllers/pdfController';
import mongoose from 'mongoose';
const downloadPdf = (req_1, res_1, _a) => __awaiter(void 0, [req_1, res_1, _a], void 0, function* (req, res, { directory, id }) {
    try {
        const modelName = directory.slice(0, 1).toUpperCase() + directory.slice(1);
        if (mongoose.models[modelName]) {
            const Model = mongoose.model(modelName);
            const result = yield Model.findOne({
                _id: id,
            }).exec();
            if (!result) {
                throw { name: 'ValidationError' };
            }
            const fileId = modelName.toLowerCase() + '-' + result._id + '.pdf';
            const folderPath = modelName.toLowerCase();
            const targetLocation = `src/public/download/${folderPath}/${fileId}`;
            yield custom.generatePdf(modelName, { filename: folderPath, format: 'A4', targetLocation }, result, () => __awaiter(void 0, void 0, void 0, function* () {
                return res.download(targetLocation, (error) => {
                    if (error)
                        return res.status(500).json({
                            success: false,
                            result: null,
                            message: "Couldn't find file",
                            error: error.message,
                        });
                });
            }));
        }
        else {
            return res.status(404).json({
                success: false,
                result: null,
                message: `Model '${modelName}' does not exist`,
            });
        }
    }
    catch (error) {
        if (error.name == 'ValidationError') {
            return res.status(400).json({
                success: false,
                result: null,
                error: error.message,
                message: 'Required fields are not supplied',
            });
        }
        else if (error.name == 'BSONTypeError') {
            return res.status(400).json({
                success: false,
                result: null,
                error: error.message,
                message: 'Invalid ID',
            });
        }
        else {
            return res.status(500).json({
                success: false,
                result: null,
                error: error.message,
                message: error.message,
                controller: 'downloadPDF.js',
            });
        }
    }
});
export default downloadPdf;
