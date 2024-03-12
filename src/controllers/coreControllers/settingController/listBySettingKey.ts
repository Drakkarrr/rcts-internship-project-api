import { Request, Response } from 'express';
import mongoose from 'mongoose';

const Model = mongoose.model('Setting');

const listBySettingKey = async (req: Request, res: Response): Promise<void> => {
  try {
    const settingKeyArray = req.query.settingKeyArray
      ? (req.query.settingKeyArray as string).split(',')
      : [];

    const settingsToShow: any = { $or: [] };

    if (settingKeyArray.length === 0) {
      res
        .status(202)
        .json({
          success: false,
          result: [],
          message: 'Please provide settings you need',
        })
        .end();
      return;
    }

    for (const settingKey of settingKeyArray) {
      settingsToShow.$or.push({ settingKey });
    }

    const results = await Model.find({
      ...settingsToShow,
    }).where('removed', false);

    if (results.length >= 1) {
      res.status(200).json({
        success: true,
        result: results,
        message: 'Successfully found all documents',
      });
    } else {
      res
        .status(202)
        .json({
          success: false,
          result: [],
          message: 'No document found by this request',
        })
        .end();
    }
  } catch (error: string | any) {
    res.status(500).json({
      success: false,
      result: [],
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export default listBySettingKey;
