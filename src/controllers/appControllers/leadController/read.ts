import { migrate } from './migrate';
import { Request, Response } from 'express';
import { Document } from 'mongoose';

const read = async (Model: any, req: Request, res: Response) => {
  try {
    const result: Document | null = await Model.findOne({
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
    });
  }
};

export default read;
