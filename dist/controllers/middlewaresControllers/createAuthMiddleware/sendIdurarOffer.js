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
import { afterRegistrationSuccess } from '@/emailTemplate/emailVerfication';
const sendIdurarOffer = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, name }) {
    const resend = new Resend(process.env.RESEND_API || '');
    const { data } = yield resend.emails.send({
        from: 'hello@rctsapp.com',
        to: email,
        subject: 'Mail from RCTS SaaS',
        html: afterRegistrationSuccess({ name }),
    });
    return data;
});
export default sendIdurarOffer;
