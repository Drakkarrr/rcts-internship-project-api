import fs from 'fs';
import { SendQuote } from '@/emailTemplate/SendEmailTemplate';
import mongoose from 'mongoose';
import { Resend } from 'resend';
import { loadSettings } from '@/middlewares/settings';
import generatePdf from '@/controllers/pdfController';
const QuoteModel = mongoose.model('Quote');
const mail = async (req, res) => {
    try {
        const { id } = req.body;
        // Throw error if no id
        if (!id) {
            throw { name: 'ValidationError' };
        }
        const result = await QuoteModel.findOne({
            _id: id,
            removed: false,
        }).exec();
        // Throw error if no result
        if (!result) {
            throw { name: 'ValidationError' };
        }
        // Continue process if result is returned
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
        const modelName = 'Quote';
        const fileId = modelName.toLowerCase() + '-' + result._id + '.pdf';
        const folderPath = modelName.toLowerCase();
        const targetLocation = `src/public/download/${folderPath}/${fileId}`;
        await generatePdf(modelName, { filename: folderPath, format: 'A4', targetLocation }, result, async () => {
            const { id: mailId } = (await sendViaApi({
                email,
                name,
                targetLocation,
            }));
            if (mailId) {
                await QuoteModel.findByIdAndUpdate({ _id: id, removed: false }, { status: 'sent' }).exec();
                // Returning successful response
                return res.status(200).json({
                    success: true,
                    result: mailId,
                    message: `Successfully sent quote to ${email}`,
                });
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
const sendViaApi = async ({ email, name, targetLocation, }) => {
    const resend = new Resend(process.env.RESEND_API);
    const settings = await loadSettings();
    const rcts_app_email = 'noreply@rctsapp.com';
    const rcts_app_company_email = settings['rcts_app_company_email'];
    const company_name = settings['company_name'];
    // Read the file to be attached
    const attachedFile = fs.readFileSync(targetLocation);
    // Send the mail using the send method
    const { data } = await resend.emails.send({
        from: rcts_app_email,
        to: email,
        subject: 'Quote From ' + company_name,
        reply_to: rcts_app_company_email,
        attachments: [
            {
                filename: 'Quote.pdf',
                content: attachedFile,
            },
        ],
        html: SendQuote({ name, title: 'Quote From ' + company_name }),
    });
    return data;
};
export default mail;
//# sourceMappingURL=sendMail.js.map