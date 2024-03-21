import { migrate } from './migrate';
import { Request, Response } from 'express';
import { Document } from 'mongoose';

const paginatedList = async (Model: any, req: Request | any, res: Response) => {
  const page: number = req.query.page ? parseInt(req.query.page.toString()) : 1;

  const limit: number = parseInt(req.query.items.toString()) || 10;
  const skip: number = page * limit - limit;

  const {
    sortBy = 'enabled',
    sortValue = -1,
    filter,
    equal,
  } = req.query as {
    sortBy?: string;
    sortValue?: number;
    filter: string;
    equal: string;
  };

  const fieldsArray: string[] = req.query.fields ? (req.query.fields as string).split(',') : [];

  let fields: any;

  fields = fieldsArray.length === 0 ? {} : { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q.toString(), 'i') } });
  }

  //  Query the database for a list of all results
  const resultsPromise: Promise<Document[]> = Model.find({
    removed: false,
    [filter]: equal,
    ...fields,
  })
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortValue })
    .populate()
    .exec();

  const countPromise: Promise<number> = Model.countDocuments({
    removed: false,
    [filter]: equal,
    ...fields,
  });
  const [result, count] = await Promise.all([resultsPromise, countPromise]);

  const pages: number = Math.ceil(count / limit);

  const pagination = { page, pages, count };
  if (count > 0) {
    const migratedData = result.map((x) => migrate(x));
    return res.status(200).json({
      success: true,
      result: migratedData,
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
