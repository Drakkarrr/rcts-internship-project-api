import { Request, Response } from 'express';
import { Model } from 'mongoose';

const remove = async (Model: Model<any>, req: Request, res: Response) => {
  // cannot delete client if it has one invoice or Client:
  // check if client has invoice or quotes:
  return res.status(400).json({
    success: false,
    result: null,
    message: 'Cannot remove currency after it was created',
  });
};

export default remove;
