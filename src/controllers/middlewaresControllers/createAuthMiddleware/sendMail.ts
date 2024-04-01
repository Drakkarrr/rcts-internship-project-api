import { Resend } from 'resend';
import { passwordVerfication, emailVerfication } from '@/emailTemplate/emailVerfication';

interface SendMailOptions {
  email: string;
  name: string;
  link: string;
  rcts_app_email: string;
  subject?: string;
  type?: 'emailVerfication' | 'passwordVerfication';
  emailToken?: string;
}

const sendMail = async ({
  email,
  name,
  link,
  rcts_app_email,
  subject = 'Verify your email | rcts',
  type = 'emailVerfication',
  emailToken,
}: SendMailOptions) => {
  const resend = new Resend(process.env.RESEND_API || '');

  const htmlContent =
    type === 'emailVerfication'
      ? emailVerfication({ name, link, emailToken } as any)
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
