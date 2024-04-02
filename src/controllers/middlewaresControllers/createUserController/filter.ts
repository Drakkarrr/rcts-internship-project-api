import { Request, Response } from 'express';
import mongoose from 'mongoose';

const filter = async (userModel: string, req: Request, res: Response | any): Promise<void> => {
  try {
    const User = mongoose.model(userModel);

    if (req.query.filter === undefined || req.query.equal === undefined) {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'Filter not provided correctly',
      });
    }

    const result = await User.find({ removed: false })
      .where(req.query.filter as any)
      .equals(req.query.equal);

    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found all documents',
    });
  } catch (error: unknown | any) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'An error occurred while filtering documents',
      error: error.message,
    });
  }
};

export default filter;
