import mongoose from 'mongoose';
const Model = mongoose.model('Setting');
const listBySettingKey = async ({ settingKeyArray = [], } = {}) => {
    try {
        const settingsToShow = { $or: [] };
        if (settingKeyArray.length === 0) {
            return [];
        }
        for (const settingKey of settingKeyArray) {
            settingsToShow.$or.push({ settingKey });
        }
        const results = await Model.find({ ...settingsToShow }).where('removed', false);
        if (results.length >= 1) {
            return results;
        }
        else {
            return [];
        }
    }
    catch (error) {
        console.error(error);
        return [];
    }
};
export default listBySettingKey;
