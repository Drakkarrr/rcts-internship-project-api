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
const read = (userModel, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const User = mongoose.model(userModel);
    // Find document by id
    const tmpResult = yield User.findOne({
        _id: req.params.id,
        removed: false,
    }).exec();
    // If no results found, return document not found
    if (!tmpResult) {
        return res.status(404).json({
            success: false,
            result: null,
            message: 'No document found ',
        });
    }
    else {
        // Return success response
        let result = {
            _id: tmpResult._id,
            enabled: tmpResult.enabled,
            email: tmpResult.email,
            name: tmpResult.name,
            surname: tmpResult.surname,
            photo: tmpResult.photo,
            role: tmpResult.role,
        };
        return res.status(200).json({
            success: true,
            result,
            message: 'we found this document ',
        });
    }
});
export default read;
