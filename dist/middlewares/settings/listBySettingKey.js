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
const listBySettingKey = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* ({ settingKeyArray = [], } = {}) {
    try {
        const settingsToShow = { $or: [] };
        if (settingKeyArray.length === 0) {
            return [];
        }
        for (const settingKey of settingKeyArray) {
            settingsToShow.$or.push({ settingKey });
        }
        const results = yield Model.find(Object.assign({}, settingsToShow)).where('removed', false);
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
});
export default listBySettingKey;
