import { Resend } from 'resend';
import { passwordVerfication, emailVerfication } from '@/emailTemplate/emailVerfication';
const sendMail = async ({ email, name, link, rcts_app_email, subject = 'Verify your email | rcts', type = 'emailVerfication', emailToken, }) => {
    const resend = new Resend(process.env.RESEND_API || '');
    const htmlContent = type === 'emailVerfication'
        ? emailVerfication({ name, link, emailToken })
        : passwordVerfication({ name, link });
    const { data } = await resend.emails.send({
        from: rcts_app_email,
        to: email,
        subject,
        html: htmlContent,
    });
    return data;
};
export default sendMail;
//# sourceMappingURL=sendMail.js.map