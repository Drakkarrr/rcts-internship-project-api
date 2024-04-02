import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { migrate } from './migrate';

const listAll = async (Model: mongoose.Model<any>, req: Request, res: Response): Promise<void> => {
  try {
    const sort: any = parseInt(req.query.sort as string) || 'desc';

    const result: any = await Model.find({
      removed: false,
    })
      .sort({ created: sort })
      .populate('')
      .exec();

    const migratedData = result.map((x: any) => migrate(x));
    if (result.length > 0) {
      res.status(200).json({
        success: true,
        result: migratedData,
        message: 'Successfully found all documents',
      });
    } else {
      res.status(203).json({
        success: true,
        result: [],
        message: 'Collection is Empty',
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      result: null,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export default listAll;
