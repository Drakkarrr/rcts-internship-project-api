var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from 'mongoose';
const Model = mongoose.model('Setting');
const updateBySettingKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const result = yield Model.findOneAndUpdate({ settingKey }, { settingValue }, { new: true, runValidators: true }).exec();
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
});
export default updateBySettingKey;
