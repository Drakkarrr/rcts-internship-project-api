import { Request, Response } from 'express';
import { Model } from 'mongoose';

const paginatedList = async (req: Request, res: Response) => {
  const page: number = req.query.page ? parseInt(req.query.page.toString()) : 1;
  const limit: number = req.query.items ? parseInt(req.query.items.toString()) : 10;
  const skip: number = (page - 1) * limit;

  const { sortBy = 'enabled', sortValue = -1, filter, equal } = req.query as any;

  const fieldsArray: string[] = req.query.fields ? (req.query.fields as string).split(',') : [];

  let fields: any = {};

  if (fieldsArray.length > 0) {
    fields.$or = fieldsArray.map((field) => ({
      [field]: { $regex: new RegExp(req.query.q as string, 'i') },
    }));
  }

  try {
    const resultsPromise = Model.find({ removed: false, [filter]: equal, ...fields })
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortValue })
      .populate('createdBy', 'name')
      .exec();

    const countPromise = Model.countDocuments({ removed: false, [filter]: equal, ...fields });

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
  } catch (error: string | any) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Internal Server Error',
    });
  }
};

export default paginatedList;
