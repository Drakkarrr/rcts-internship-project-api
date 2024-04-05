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
const listAll = (userModel, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const User = mongoose.model(userModel);
    const limit = parseInt(req.query.items, 10) || 100;
    try {
        // Query the database for a list of all results
        const result = yield User.find({ removed: false, enabled: true })
            .sort({ enabled: -1 })
            .populate('')
            .exec();
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                result,
                message: 'Successfully found all documents',
            });
        }
        else {
            return res.status(203).json({
                success: false,
                result: [],
                message: 'Collection is Empty',
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'An error occurred while fetching documents',
            error: error.message,
        });
    }
});
export default listAll;
