import { Document, Model, PopulatedDoc } from 'mongoose';
import { Request, Response } from 'express';
import { migrate } from './migrate';

interface Pagination {
  page: number;
  pages: number;
  count: number;
}

interface PaginatedListResponse<T> {
  success: boolean;
  result: T[];
  pagination: Pagination;
  message: string;
}

const paginatedList = async (
  Model: Model<Document>,
  req: Request,
  res: Response
): Promise<void> => {
  const page: number = parseInt(req.query.page as string, 10) || 1;
  const limit: number = parseInt(req.query.items as string, 10) || 10;
  const skip: number = page * limit - limit;

  const { sortBy = 'enabled', sortValue = -1, filter, equal } = req.query;

  const fieldsArray: string[] = req.query.fields ? (req.query.fields as string).split(',') : [];

  let fields: { $or?: Record<string, unknown>[] } = fieldsArray.length === 0 ? {} : { $or: [] };

  for (const field of fieldsArray) {
    fields.$or?.push({ [field]: { $regex: new RegExp(req.query.q as string, 'i') } });
  }

  const resultsPromise: PopulatedDoc<Document>[] | any = await Model.find({
    removed: false,
    [filter as string]: equal,
    ...fields,
  })
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy as string]: sortValue } as any)
    .populate()
    .exec();

  const countPromise: number | any = Model.countDocuments({
    removed: false,
    [filter as string]: equal,
    ...fields,
  });
  const [result, count] = await Promise.all([resultsPromise, countPromise]);

  const pages: number = Math.ceil(count / limit);

  const pagination: Pagination = { page, pages, count };
  if (count > 0) {
    const migratedData = result.map((x: any) => migrate(x));
    const response: PaginatedListResponse<Record<string, unknown>> = {
      success: true,
      result: migratedData,
      pagination,
      message: 'Successfully found all documents',
    };
    return res.status(200).json(response) as any;
  } else {
    const response: PaginatedListResponse<Record<string, unknown>> = {
      success: true,
      result: [],
      pagination,
      message: 'Collection is Empty',
    };
    return res.status(203).json(response) as any;
  }
};

export default paginatedList;
