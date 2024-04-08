import mongoose from 'mongoose';
const Model = mongoose.model('Setting');
const increaseBySettingKey = async ({ settingKey, }) => {
    try {
        if (!settingKey) {
            return null;
        }
        const result = await Model.findOneAndUpdate({ settingKey }, {
            $inc: { settingValue: 1 },
        }, {
            new: true,
            runValidators: true,
        }).exec();
        if (!result) {
            return null;
        }
        else {
            return result;
        }
    }
    catch {
        return null;
    }
};
export default increaseBySettingKey;
