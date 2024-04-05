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
import shortid from 'shortid';
import checkAndCorrectURL from './checkAndCorrectURL';
import sendMail from './sendMail';
import { useAppSettings } from '@/settings';
const forgetPassword = (req_1, res_1, _a) => __awaiter(void 0, [req_1, res_1, _a], void 0, function* (req, res, { userModel }) {
    const UserPassword = mongoose.model(`${userModel}Password`);
    const User = mongoose.model(userModel);
    const { email } = req.body;
    // Validate email
    const objectSchema = Joi.object({
        email: Joi.string()
            .email({ tlds: { allow: true } })
            .required(),
    });
    const { error, value } = objectSchema.validate({ email });
    if (error) {
        const errorMessage = error.message;
        return res.status(409).json({
            success: false,
            result: null,
            error: error,
            message: 'Invalid email.',
            errorMessage,
        });
    }
    // Check if user exists and is enabled
    const user = yield User.findOne({ email, removed: false });
    if (!user) {
        return res.status(404).json({
            success: false,
            result: null,
            message: 'No account with this email has been registered.',
        });
    }
    if (!user.enabled) {
        return res.status(409).json({
            success: false,
            result: null,
            message: 'Your account is disabled, contact your account administrator',
        });
    }
    // Generate reset token and update user password document
    const resetToken = shortid.generate();
    yield UserPassword.findOneAndUpdate({ user: user._id }, { resetToken }, { new: true }).exec();
    // Send password reset email
    const settings = useAppSettings();
    const rctsAppEmail = settings['rcts_app_email'];
    const rctsBaseUrl = settings['rcts_base_url'];
    const url = checkAndCorrectURL(rctsBaseUrl);
    const link = `${url}/resetpassword/${user._id}/${resetToken}`;
    yield sendMail({
        email,
        name: user.name,
        link,
        subject: 'Reset your password | rcts',
        rctsAppEmail,
        type: 'passwordVerification',
    });
    return res.status(200).json({
        success: true,
        result: null,
        message: 'Check your email inbox to reset your password.',
    });
});
export default forgetPassword;
