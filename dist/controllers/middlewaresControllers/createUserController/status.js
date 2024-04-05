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
const status = (userModel, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const User = mongoose.model(userModel);
    if (typeof req.query.enabled === 'boolean') {
        let updates = {
            enabled: req.query.enabled,
        };
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
        else {
            return res.status(200).json({
                success: true,
                result,
                message: 'Successfully update status of this document ',
            });
        }
    }
    else {
        return res.status(202).json({
            success: false,
            result: [],
            message: "couldn't change admin status by this request",
        });
    }
});
export default status;
