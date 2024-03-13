import { Request, Response } from 'express';
import mongoose, { Document } from 'mongoose';

const Model = mongoose.model<Document>('Invoice');

const read = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const result = await Model.findOne({
      _id: req.params.id,
      removed: false,
    })
      .populate('createdBy', 'name')
      .exec();
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found ',
      });
    } else {
      return res.status(200).json({
        success: true,
        result,
        message: 'We found this document ',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
    });
  }
};

export default read;
