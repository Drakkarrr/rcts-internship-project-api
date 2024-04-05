var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Joi from 'joi';
import mongoose from 'mongoose';
import authUser from './authUser';
const login = (req_1, res_1, _a) => __awaiter(void 0, [req_1, res_1, _a], void 0, function* (req, res, { userModel }) {
    const UserPasswordModel = mongoose.model(userModel + 'Password');
    const UserModel = mongoose.model(userModel);
    const { email, password } = req.body;
    // validate
    const objectSchema = Joi.object({
        email: Joi.string()
            .email({ tlds: { allow: true } })
            .required(),
        password: Joi.string().required(),
    });
    const { error, value } = objectSchema.validate({ email, password });
    if (error) {
        return res.status(409).json({
            success: false,
            result: null,
            error: error,
            message: 'Invalid/Missing credentials.',
            errorMessage: error.message,
        });
    }
    const user = yield UserModel.findOne({ email: email, removed: false });
    if (!user) {
        return res.status(404).json({
            success: false,
            result: null,
            message: 'No account with this email has been registered.',
        });
    }
    const databasePassword = yield UserPasswordModel.findOne({ user: user._id, removed: false });
    if (!user.enabled) {
        return res.status(409).json({
            success: false,
            result: null,
            message: 'Your account is disabled, contact your account adminstrator',
        });
    }
    //  authUser if your has correct password
    yield authUser(req, res, { user, databasePassword, password, UserPasswordModel });
});
export default login;
