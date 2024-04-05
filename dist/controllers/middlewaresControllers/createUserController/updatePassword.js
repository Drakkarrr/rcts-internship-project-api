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
import bcrypt from 'bcryptjs';
import { generate as uniqueId } from 'shortid';
const updatePassword = (userModel, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const UserPassword = mongoose.model(userModel + 'Password');
    const reqUserName = userModel.toLowerCase();
    const userProfile = req[reqUserName];
    let { password } = req.body;
    if (password.length < 8)
        return res.status(400).json({
            msg: 'The password needs to be at least 8 characters long.',
        });
    const salt = uniqueId();
    const passwordHash = bcrypt.hashSync(salt + password);
    const UserPasswordData = {
        password: passwordHash,
        salt: salt,
    };
    const resultPassword = yield UserPassword.findOneAndUpdate({ user: req.params.id, removed: false }, { $set: UserPasswordData }, {
        new: true, // return the new result instead of the old one
    }).exec();
    if (!resultPassword) {
        return res.status(403).json({
            success: false,
            result: null,
            message: "User Password couldn't save correctly",
        });
    }
    return res.status(200).json({
        success: true,
        result: {},
        message: 'we update the password by this id: ' + userProfile._id,
    });
});
export default updatePassword;
