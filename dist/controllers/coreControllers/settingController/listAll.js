var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from 'mongoose';
const Model = mongoose.model('Setting');
const listAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sort = parseInt(req.query.sort) || 'desc';
        const result = yield Model.find({
            removed: false,
            isPrivate: false,
        }).sort({ created: sort });
        if (result.length > 0) {
            res.status(200).json({
                success: true,
                result,
                message: 'Successfully found all documents',
            });
        }
        else {
            res.status(203).json({
                success: false,
                result: [],
                message: 'Collection is Empty',
            });
        }
    }
    catch (error) {
        console.error('Error in listAll:', error);
        res.status(500).json({
            success: false,
            result: null,
            message: 'Internal Server Error',
        });
    }
});
export default listAll;
