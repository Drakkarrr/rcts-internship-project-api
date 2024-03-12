import { Request, Response } from 'express';
import { Model, Document } from 'mongoose';
import { migrate } from './migrate';

interface QueryParams {
  id: string;
}

const read = async (
  Model: Model<Document>,
  req: Request<{}, {}, {}, QueryParams>,
  res: Response
) => {
  let result: any = await Model.findOne({
    _id: req.params.id,
    removed: false,
  }).exec();
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
    });
  } else {
    const migratedData = migrate(result);

    return res.status(200).json({
      success: true,
      result: migratedData,
      message: 'we found this document ',
    });
  }
};

export default read;
