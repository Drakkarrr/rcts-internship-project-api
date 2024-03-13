import { Request, Response } from 'express';
import mongoose, { Document } from 'mongoose';

const Model = mongoose.model<Document>('Invoice');
const ModalPayment = mongoose.model<Document>('Payment');

const remove = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const deletedInvoice = await Model.findOneAndUpdate(
      {
        _id: req.params.id,
        removed: false,
      },
      {
        $set: {
          removed: true,
        },
      }
    ).exec();

    if (!deletedInvoice) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Invoice not found',
      });
    }
    const paymentsInvoices = await ModalPayment.updateMany(
      { invoice: deletedInvoice._id },
      { $set: { removed: true } }
    );
    return res.status(200).json({
      success: true,
      result: deletedInvoice,
      message: 'Invoice deleted successfully',
    });
  } catch (error) {
    // Handle error
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
    });
  }
};

export default remove;
