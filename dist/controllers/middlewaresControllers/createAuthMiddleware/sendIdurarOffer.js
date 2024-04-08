import { Resend } from 'resend';
import { afterRegistrationSuccess } from '@/emailTemplate/emailVerfication';
const sendIdurarOffer = async ({ email, name }) => {
    const resend = new Resend(process.env.RESEND_API || '');
    const { data } = await resend.emails.send({
        from: 'hello@rctsapp.com',
        to: email,
        subject: 'Mail from RCTS SaaS',
        html: afterRegistrationSuccess({ name }),
    });
    return data;
};
export default sendIdurarOffer;
//# sourceMappingURL=sendIdurarOffer.js.map