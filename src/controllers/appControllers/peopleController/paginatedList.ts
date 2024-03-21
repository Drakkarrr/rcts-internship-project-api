import { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';

const paginatedList = async (Model: Model<any>, req: Request, res: Response) => {
  const page: number = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit: number = req.query.items ? parseInt(req.query.items as string) : 10;
  const skip: number = page * limit - limit;

  const { sortBy = 'enabled', sortValue = -1, filter, equal } = req.query as any;

  const fieldsArray: string[] = req.query.fields ? (req.query.fields as string).split(',') : [];

  let fields: any;

  fields = fieldsArray.length === 0 ? {} : { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q as string, 'i') } });
  }

  try {
    // Query the database for a list of all results
    const resultsPromise = Model.find({
      removed: false,
      [filter]: equal,
      ...fields,
    })
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortValue })
      .populate('company', 'name')
      .exec();

    // Counting the total documents
    const countPromise = Model.countDocuments({
      removed: false,
      [filter]: equal,
      ...fields,
    });

    // Resolving both promises
    const [result, count] = await Promise.all([resultsPromise, countPromise]);

    // Calculating total pages
    const pages = Math.ceil(count / limit);

    // Getting Pagination Object
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
  } catch (error: string | any) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Internal Server Error',
    });
  }
};

export default paginatedList;
