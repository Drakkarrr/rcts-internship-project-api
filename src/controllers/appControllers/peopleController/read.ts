import { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';

const read = async (Model: Model<any>, req: Request, res: Response) => {
  try {
    // Find document by id
    const result = await Model.findOne({
      _id: req.params.id,
      removed: false,
    })
      .populate('company', 'name')
      .exec();

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found',
      });
    } else {
      return res.status(200).json({
        success: true,
        result,
        message: 'Document found successfully',
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Internal Server Error',
    });
  }
};

export default read;
