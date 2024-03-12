import { Request, Response } from 'express';
import mongoose from 'mongoose';

const Model = mongoose.model('Setting');

const updateManySetting = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.body = [{settingKey:"", settingValue:""}]
    let settingsHasError = false;
    const updateDataArray: any[] = [];
    const { settings } = req.body;

    for (const setting of settings) {
      if (!setting.hasOwnProperty('settingKey') || !setting.hasOwnProperty('settingValue')) {
        settingsHasError = true;
        break;
      }

      const { settingKey, settingValue } = setting;

      updateDataArray.push({
        updateOne: {
          filter: { settingKey: settingKey },
          update: { settingValue: settingValue },
        },
      });
    }

    if (updateDataArray.length === 0) {
      res.status(202).json({
        success: false,
        result: null,
        message: 'No settings provided',
      });
      return;
    }

    if (settingsHasError) {
      res.status(202).json({
        success: false,
        result: null,
        message: 'Settings provided have an error',
      });
      return;
    }

    const result: any = await Model.bulkWrite(updateDataArray);

    if (!result || result.nMatched < 1) {
      res.status(404).json({
        success: false,
        result: null,
        message: 'No settings found to update',
      });
    } else {
      res.status(200).json({
        success: true,
        result: [],
        message: 'Updated all settings',
      });
    }
  } catch (error: string | any) {
    res.status(500).json({
      success: false,
      result: null,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export default updateManySetting;
