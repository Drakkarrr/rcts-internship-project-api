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
const remove = (userModel, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const User = mongoose.model(userModel);
        const updates = {
            enabled: false,
        };
        // Find the document by id and delete it
        const user = yield User.findOne({
            _id: req.params.id,
            removed: false,
        }).exec();
        if (!user) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No document found ',
            });
        }
        if (user.role === 'admin' || user.role === 'owner') {
            return res.status(403).json({
                success: false,
                result: null,
                message: "Can't remove a user with role 'admin'",
            });
        }
        // Find the document by id and delete it
        const result = yield User.findOneAndUpdate({ _id: req.params.id, removed: false }, { $set: updates }, {
            new: true, // return the new result instead of the old one
        }).exec();
        if (!result) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No document found ',
            });
        }
        return res.status(200).json({
            success: true,
            result,
            message: 'Successfully deleted the document ',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'An error occurred while deleting the document',
            error: error.message,
        });
    }
});
export default remove;
