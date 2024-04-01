import { Request, Response } from 'express';
import { Document } from 'mongoose';

const create = async <T extends Document>(
  Model: new (args: any) => T,
  req: Request,
  res: Response
) => {
  try {
    req.body.removed = false;
    const result = await new Model({
      ...req.body,
    }).save();

    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully Created the document in Model ',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to create document',
    });
  }
};

export default create;
