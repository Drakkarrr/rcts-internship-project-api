import fs from 'fs';
import mongoose from 'mongoose';
import { Resend } from 'resend';
import { loadSettings } from '@/middlewares/settings';
import { SendPaymentReceipt } from '@/emailTemplate/SendEmailTemplate';
import pdfController from '@/controllers/pdfController';
const PaymentModel = mongoose.model('Payment');
const mail = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        throw new Error('ValidationError');
    }
    const result = await PaymentModel.findOne({
        _id: id,
        removed: false,
    }).exec();
    if (!result) {
        throw new Error('ValidationError');
    }
    const { client } = result;
    const { name } = client;
    const email = client[client.type].email;
    if (!email) {
        return res.status(403).json({
            success: false,
            result: null,
            message: 'Client has no email, add new email and try again',
        });
    }
    const modelName = 'Payment';
    const fileId = `${modelName.toLowerCase()}-${result._id}.pdf`;
    const folderPath = modelName.toLowerCase();
    const targetLocation = `src/public/download/${folderPath}/${fileId}`;
    await pdfController.generatePdf(modelName, { filename: folderPath, format: 'A4', targetLocation }, result, async () => {
        const { id: mailId } = (await sendViaApi({
            email,
            name,
            targetLocation,
        }));
        if (mailId) {
            await PaymentModel.findByIdAndUpdate({ _id: id, removed: false }, { status: 'sent' }).exec();
            return res.status(200).json({
                success: true,
                result: mailId,
                message: `Successfully sent Payment to ${email}`,
            });
        }
    });
};
const sendViaApi = async ({ email, name, targetLocation, }) => {
    const resend = new Resend(process.env.RESEND_API);
    const settings = await loadSettings();
    const rcts_app_email = 'noreply@rctsapp.com';
    const rcts_app_company_email = settings['rcts_app_company_email'];
    const company_name = settings['company_name'];
    const attatchedFile = fs.readFileSync(targetLocation);
    const { data } = await resend.emails.send({
        from: rcts_app_email,
        to: email,
        subject: `Payment receipt From ${company_name}`,
        reply_to: rcts_app_company_email,
        attachments: [
            {
                filename: 'Payment.pdf',
                content: attatchedFile,
            },
        ],
        html: SendPaymentReceipt({ name, title: `Payment receipt From ${company_name}` }),
    });
    return data;
};
export default mail;
