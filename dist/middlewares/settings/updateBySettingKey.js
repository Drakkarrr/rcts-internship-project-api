import mongoose from 'mongoose';
const Model = mongoose.model('Setting');
const updateBySettingKey = async ({ settingKey, settingValue, }) => {
    try {
        if (!settingKey || !settingValue) {
            return null;
        }
        const result = await Model.findOneAndUpdate({ settingKey }, { settingValue }, {
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
    catch (error) {
        console.error(error);
        return null;
    }
};
export default updateBySettingKey;
//# sourceMappingURL=updateBySettingKey.js.map