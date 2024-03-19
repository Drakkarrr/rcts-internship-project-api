import mongoose, { Document } from 'mongoose';

interface ISetting extends Document {
  settingKey: string;
  settingValue: number;
}

const Model = mongoose.model<ISetting>('Setting');

const increaseBySettingKey = async ({
  settingKey,
}: {
  settingKey: string;
}): Promise<ISetting | null> => {
  try {
    if (!settingKey) {
      return null;
    }

    const result = await Model.findOneAndUpdate(
      { settingKey },
      {
        $inc: { settingValue: 1 },
      },
      {
        new: true,
        runValidators: true,
      }
    ).exec();

    if (!result) {
      return null;
    } else {
      return result;
    }
  } catch {
    return null;
  }
};

export default increaseBySettingKey;
