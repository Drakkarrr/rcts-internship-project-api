var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
import mongoose from 'mongoose';
import { Resend } from 'resend';
import { loadSettings } from '@/middlewares/settings';
import { SendPaymentReceipt } from '@/emailTemplate/SendEmailTemplate';
import pdfController from '@/controllers/pdfController';
const PaymentModel = mongoose.model('Payment');
const mail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id) {
        throw new Error('ValidationError');
    }
    const result = yield PaymentModel.findOne({
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
    yield pdfController.generatePdf(modelName, { filename: folderPath, format: 'A4', targetLocation }, result, () => __awaiter(void 0, void 0, void 0, function* () {
        const { id: mailId } = (yield sendViaApi({
            email,
            name,
            targetLocation,
        }));
        if (mailId) {
            yield PaymentModel.findByIdAndUpdate({ _id: id, removed: false }, { status: 'sent' }).exec();
            return res.status(200).json({
                success: true,
                result: mailId,
                message: `Successfully sent Payment to ${email}`,
            });
        }
    }));
});
const sendViaApi = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, name, targetLocation, }) {
    const resend = new Resend(process.env.RESEND_API);
    const settings = yield loadSettings();
    const rcts_app_email = 'noreply@rctsapp.com';
    const rcts_app_company_email = settings['rcts_app_company_email'];
    const company_name = settings['company_name'];
    const attatchedFile = fs.readFileSync(targetLocation);
    const { data } = yield resend.emails.send({
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
});
export default mail;
