import { Request, Response } from 'express';
import { Model } from 'mongoose';

const read = async (Model: Model<any>, req: Request, res: Response | any): Promise<void> => {
  try {
    // Find document by id
    const result = await Model.findOne({
      _id: req.params.id,
      removed: false,
    }).exec();

    // If no results found, return document not found
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found',
      });
    } else {
      // Return success response
      return res.status(200).json({
        success: true,
        result,
        message: 'Document found successfully',
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'An error occurred while fetching the document',
      error: error.message,
    });
  }
};

export default read;
