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
const listBySettingKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settingKeyArray = req.query.settingKeyArray
            ? req.query.settingKeyArray.split(',')
            : [];
        const settingsToShow = { $or: [] };
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
        const results = yield Model.find(Object.assign({}, settingsToShow)).where('removed', false);
        if (results.length >= 1) {
            res.status(200).json({
                success: true,
                result: results,
                message: 'Successfully found all documents',
            });
        }
        else {
            res
                .status(202)
                .json({
                success: false,
                result: [],
                message: 'No document found by this request',
            })
                .end();
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            result: [],
            message: 'Internal Server Error',
            error: error.message,
        });
    }
});
export default listBySettingKey;
