import { Request, Response } from 'express';
import { Model, Document } from 'mongoose';

const update = async (Model: Model<Document>, req: Request, res: Response) => {
  return res.status(200).json({
    success: false,
    result: null,
    message: 'You cant update client once it is created',
  });
};

export default update;
