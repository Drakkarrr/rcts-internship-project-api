import { Request, Response } from 'express';
import { Model } from 'mongoose';

const search = async (
  Model: Model<any>,
  req: Request | any,
  res: Response | any
): Promise<void> => {
  try {
    const fieldsArray: string[] = req.query.fields ? req.query.fields.split(',') : ['name'];

    const fields = { $or: [] } as any;

    for (const field of fieldsArray) {
      fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
    }

    const results = await Model.find({
      ...fields,
      removed: false,
    })
      .limit(20)
      .exec();

    if (results.length >= 1) {
      return res.status(200).json({
        success: true,
        result: results,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(202).json({
        success: false,
        result: [],
        message: 'No document found by this request',
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'An error occurred while searching for documents',
      error: error.message,
    });
  }
};

export default search;
