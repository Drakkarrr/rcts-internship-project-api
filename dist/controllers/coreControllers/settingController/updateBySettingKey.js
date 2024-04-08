import mongoose from 'mongoose';
const Model = mongoose.model('Setting');
const updateBySettingKey = async (req, res) => {
    try {
        const settingKey = req.params.settingKey;
        if (!settingKey) {
            res.status(202).json({
                success: false,
                result: null,
                message: 'No settingKey provided',
            });
            return;
        }
        const { settingValue } = req.body;
        if (!settingValue) {
            res.status(202).json({
                success: false,
                result: null,
                message: 'No settingValue provided',
            });
            return;
        }
        const result = await Model.findOneAndUpdate({ settingKey }, { settingValue }, { new: true, runValidators: true }).exec();
        if (!result) {
            res.status(404).json({
                success: false,
                result: null,
                message: `No document found by this settingKey: ${settingKey}`,
            });
        }
        else {
            res.status(200).json({
                success: true,
                result,
                message: `Updated document by this settingKey: ${settingKey}`,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            result: null,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
export default updateBySettingKey;
