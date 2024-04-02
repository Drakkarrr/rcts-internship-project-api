import { Request, Response } from 'express';
import mongoose from 'mongoose';

const search = async (userModel: string, req: Request, res: Response) => {
  const User = mongoose.model(userModel);

  const fieldsArray = req.query.fields
    ? (req.query.fields as string).split(',')
    : ['name', 'surname', 'email'];

  const fields: { $or: { [key: string]: { $regex: RegExp } }[] } = { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q as string, 'i') } });
  }

  let result = await User.find({
    ...fields,
    removed: false,
  })
    .sort({ enabled: -1 })
    .limit(20)
    .exec();

  if (result.length >= 1) {
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found all documents',
    });
  } else {
    return res.status(202).json({
      success: false,
      result: [],
      message: 'No document found by this request',
    });
  }
};

export default search;
