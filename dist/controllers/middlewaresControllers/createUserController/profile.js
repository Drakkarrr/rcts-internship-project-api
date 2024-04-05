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
const profile = (userModel, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const User = mongoose.model(userModel);
    // Query the database for a list of all results
    if (!req.admin) {
        return res.status(404).json({
            success: false,
            result: null,
            message: "couldn't find admin Profile ",
        });
    }
    let result = {
        _id: req.admin._id,
        email: req.admin.email,
        name: req.admin.name,
        surname: req.admin.surname,
        photo: req.admin.photo,
        role: req.admin.role,
    };
    return res.status(200).json({
        success: true,
        result,
        message: 'Successfully found Profile',
    });
});
export default profile;
