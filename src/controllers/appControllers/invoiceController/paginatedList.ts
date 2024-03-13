import { Request, Response } from 'express';
import mongoose, { Document } from 'mongoose';

interface QueryParams {
  page?: number;
  items?: number;
  sortBy?: string;
  sortValue?: number;
  filter?: string;
  equal?: string;
  fields?: string;
  q?: string;
}

const Model = mongoose.model<Document>('Invoice');

const paginatedList = async (req: Request<{}, {}, {}, QueryParams | any>, res: Response) => {
  const page: number = req.query.page || 1;
  const limit: number = parseInt(req.query.items as any) || 10;
  const skip: number = page * limit - limit;

  const { sortBy = 'enabled', sortValue = -1, filter, equal } = req.query;

  const fieldsArray: string[] = req.query.fields ? req.query.fields.split(',') : [];

  let fields: any;

  fields = fieldsArray.length === 0 ? {} : { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
  }

  const resultsPromise = Model.find({
    removed: false,

    [filter || '']: equal || '',
    ...fields,
  })
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortValue })
    .populate('createdBy', 'name')
    .exec();

  const countPromise = Model.countDocuments({
    removed: false,

    [filter || '']: equal || '',
    ...fields,
  });

  const [result, count] = await Promise.all([resultsPromise, countPromise]);
  const pages = Math.ceil(count / limit);

  const pagination = { page, pages, count };
  if (count > 0) {
    return res.status(200).json({
      success: true,
      result,
      pagination,
      message: 'Successfully found all documents',
    });
  } else {
    return res.status(203).json({
      success: true,
      result: [],
      pagination,
      message: 'Collection is Empty',
    });
  }
};

export default paginatedList;
