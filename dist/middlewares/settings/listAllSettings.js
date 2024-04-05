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
const listAllSettings = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Model.find({ removed: false }).exec();
        if (result.length > 0) {
            return result;
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
export default listAllSettings;
