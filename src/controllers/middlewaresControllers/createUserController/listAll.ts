import { Request, Response } from 'express';
import mongoose from 'mongoose';

const listAll = async (userModel: string, req: Request, res: Response) => {
  const User = mongoose.model(userModel);

  const limit = parseInt(req.query.items as string, 10) || 100;

  try {
    // Query the database for a list of all results
    const result = await User.find({ removed: false, enabled: true })
      .sort({ enabled: -1 })
      .populate('')
      .exec();

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        result,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(203).json({
        success: false,
        result: [],
        message: 'Collection is Empty',
      });
    }
  } catch (error: unknown | any) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'An error occurred while fetching documents',
      error: error.message,
    });
  }
};

export default listAll;
