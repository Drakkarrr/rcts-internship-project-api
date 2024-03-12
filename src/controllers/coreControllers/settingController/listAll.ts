import { Request, Response } from 'express';
import mongoose, { Document } from 'mongoose';

const Model = mongoose.model('Setting');

const listAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const sort = parseInt(req.query.sort as string) || 'desc';

    const result = await Model.find({
      removed: false,
      isPrivate: false,
    }).sort({ created: sort } as any);

    if (result.length > 0) {
      res.status(200).json({
        success: true,
        result,
        message: 'Successfully found all documents',
      });
    } else {
      res.status(203).json({
        success: false,
        result: [],
        message: 'Collection is Empty',
      });
    }
  } catch (error) {
    console.error('Error in listAll:', error);
    res.status(500).json({
      success: false,
      result: null,
      message: 'Internal Server Error',
    });
  }
};

export default listAll;
