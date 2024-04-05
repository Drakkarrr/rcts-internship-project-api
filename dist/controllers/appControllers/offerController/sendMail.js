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
import custom from '@/controllers/pdfController';
import { SendOffer } from '@/emailTemplate/SendEmailTemplate';
import mongoose from 'mongoose';
import { Resend } from 'resend';
import { loadSettings } from '@/middlewares/settings';
const OfferModel = mongoose.model('Offer');
const mail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        if (!id) {
            throw new Error('ValidationError');
        }
        const result = yield OfferModel.findOne({
            _id: id,
            removed: false,
        }).exec();
        if (!result) {
            throw new Error('ValidationError');
        }
        const { lead } = result;
        const { name } = lead;
        const email = lead[lead.type].email;
        if (!email) {
            return res.status(403).json({
                success: false,
                result: null,
                message: 'Lead has no email, add new email and try again',
            });
        }
        const modelName = 'Offer';
        const fileId = modelName.toLowerCase() + '-' + result._id + '.pdf';
        const folderPath = modelName.toLowerCase();
        const targetLocation = `src/public/download/${folderPath}/${fileId}`;
        yield custom.generatePdf(modelName, { filename: folderPath, format: 'A4', targetLocation }, result, () => __awaiter(void 0, void 0, void 0, function* () {
            const { id: mailId } = (yield sendViaApi({
                email,
                name,
                targetLocation,
            }));
            if (mailId) {
                yield OfferModel.findByIdAndUpdate({ _id: id, removed: false }, { status: 'sent' }).exec();
                return res.status(200).json({
                    success: true,
                    result: mailId,
                    message: `Successfully sent offer to ${email}`,
                });
            }
        }));
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
});
const sendViaApi = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, name, targetLocation, }) {
    const resend = new Resend(process.env.RESEND_API);
    const settings = yield loadSettings();
    const rcts_app_email = 'noreply@rctsapp.com';
    const rcts_app_company_email = settings['rcts_app_company_email'];
    const company_name = settings['company_name'];
    // Read the file to be attached
    const attatchedFile = fs.readFileSync(targetLocation);
    // Send the mail using the send method
    const { data } = yield resend.emails.send({
        from: rcts_app_email,
        to: email,
        subject: 'Offer From ' + company_name,
        reply_to: rcts_app_company_email,
        attachments: [
            {
                filename: 'Offer.pdf',
                content: attatchedFile,
            },
        ],
        html: SendOffer({ name, title: 'Offer From ' + company_name }),
    });
    return data;
});
export default mail;
