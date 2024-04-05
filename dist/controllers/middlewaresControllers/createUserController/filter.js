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
const filter = (userModel, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const User = mongoose.model(userModel);
        if (req.query.filter === undefined || req.query.equal === undefined) {
            return res.status(403).json({
                success: false,
                result: null,
                message: 'Filter not provided correctly',
            });
        }
        const result = yield User.find({ removed: false })
            .where(req.query.filter)
            .equals(req.query.equal);
        return res.status(200).json({
            success: true,
            result,
            message: 'Successfully found all documents',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'An error occurred while filtering documents',
            error: error.message,
        });
    }
});
export default filter;
