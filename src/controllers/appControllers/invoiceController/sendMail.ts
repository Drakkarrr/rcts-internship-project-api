import fs from 'fs';
import mongoose from 'mongoose';
import { Resend } from 'resend';
import { SendInvoice } from '@/emailTemplate/SendEmailTemplate';
import { loadSettings } from '@/middlewares/settings';
import generatePdf from '@/controllers/pdfController';
import { useAppSettings } from '@/settings';

const InvoiceModel = mongoose.model('Invoice');

const mail = async (req: any, res: any) => {
  const { id } = req.body;

  // Throw error if no id
  if (!id) {
    throw { name: 'ValidationError' };
  }

  const result = await InvoiceModel.findOne({
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

  const modelName = 'Invoice';

  const fileId = modelName.toLowerCase() + '-' + result._id + '.pdf';
  const folderPath = modelName.toLowerCase();
  const targetLocation = `src/public/download/${folderPath}/${fileId}`;

  await generatePdf(
    modelName,
    { filename: folderPath, format: 'A4', targetLocation },
    result,
    async () => {
      const { id: mailId } = (await sendViaApi({
        email,
        name,
        targetLocation,
      })) as any;

      if (mailId) {
        await InvoiceModel.findByIdAndUpdate(
          { _id: id, removed: false },
          { status: 'sent' }
        ).exec();

        // Returning successfull response
        return res.status(200).json({
          success: true,
          result: mailId,
          message: `Successfully sent invoice to ${email}`,
        });
      }
    }
  );
};

const sendViaApi = async ({ email, name, targetLocation }: any) => {
  try {
    const resend = new Resend(process.env.RESEND_API);

    const settings = await loadSettings();
    const rcts_app_email = 'noreply@rctsapp.com';
    const rcts_app_company_email = settings['rcts_app_company_email'];
    const company_name = settings['company_name'];
    // Read the file to be attatched
    const attatchedFile = fs.readFileSync(targetLocation);

    // Send the mail using the send method
    const { data } = await resend.emails.send({
      from: rcts_app_email,
      to: email,
      subject: 'Invoice From ' + company_name,
      reply_to: rcts_app_company_email,
      attachments: [
        {
          filename: 'Invoice.pdf',
          content: attatchedFile,
        },
      ],
      html: SendInvoice({ name, title: 'Invoice From ' + company_name }),
    });

    return data;
  } catch (error) {
    throw new Error('error while sending email');
  }
};

export default mail;
