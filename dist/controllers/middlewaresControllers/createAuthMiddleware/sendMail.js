var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Resend } from 'resend';
import { passwordVerfication, emailVerfication } from '@/emailTemplate/emailVerfication';
const sendMail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, name, link, rcts_app_email, subject = 'Verify your email | rcts', type = 'emailVerfication', emailToken, }) {
    const resend = new Resend(process.env.RESEND_API || '');
    const htmlContent = type === 'emailVerfication'
        ? emailVerfication({ name, link, emailToken })
        : passwordVerfication({ name, link });
    const { data } = yield resend.emails.send({
        from: rcts_app_email,
        to: email,
        subject,
        html: htmlContent,
    });
    return data;
});
export default sendMail;
