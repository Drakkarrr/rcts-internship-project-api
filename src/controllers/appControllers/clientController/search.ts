import { Request, Response } from 'express';
import { Model, Document } from 'mongoose';
import { migrate } from './migrate';

interface QueryParams {
  q: string;
  fields?: string;
}

const search = async (
  Model: Model<Document>,
  req: Request<{}, {}, {}, QueryParams>,
  res: Response
) => {
  const fieldsArray = req.query.fields ? req.query.fields.split(',') : ['name'];

  const fields: { $or: { [key: string]: { $regex: RegExp } }[] } = { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
  }
  // console.log(fields)

  let results = await Model.find({
    ...fields,
  })
    .where('removed', false)
    .limit(20)
    .exec();

  const migratedData = results.map((x: any) => migrate(x));

  if (results.length >= 1) {
    return res.status(200).json({
      success: true,
      result: migratedData,
      message: 'Successfully found all documents',
    });
  } else {
    return res
      .status(202)
      .json({
        success: false,
        result: [],
        message: 'No document found by this request',
      })
      .end();
  }
};

export default search;
