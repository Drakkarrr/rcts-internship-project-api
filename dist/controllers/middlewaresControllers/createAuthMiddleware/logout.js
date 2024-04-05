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
const logout = (req_1, res_1, _a) => __awaiter(void 0, [req_1, res_1, _a], void 0, function* (req, res, { userModel }) {
    const UserPassword = mongoose.model(userModel + 'Password');
    const token = req.cookies.token;
    yield UserPassword.findOneAndUpdate({ user: req.admin._id }, { $pull: { loggedSessions: token } }, {
        new: true,
    }).exec();
    res
        .clearCookie('token', {
        maxAge: null,
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        domain: req.hostname,
        path: '/',
    })
        .json({
        success: true,
        result: {},
        message: 'Successfully logout',
    });
});
export default logout;
