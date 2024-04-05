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
const search = (userModel, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const User = mongoose.model(userModel);
    const fieldsArray = req.query.fields
        ? req.query.fields.split(',')
        : ['name', 'surname', 'email'];
    const fields = { $or: [] };
    for (const field of fieldsArray) {
        fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
    }
    let result = yield User.find(Object.assign(Object.assign({}, fields), { removed: false }))
        .sort({ enabled: -1 })
        .limit(20)
        .exec();
    if (result.length >= 1) {
        return res.status(200).json({
            success: true,
            result,
            message: 'Successfully found all documents',
        });
    }
    else {
        return res.status(202).json({
            success: false,
            result: [],
            message: 'No document found by this request',
        });
    }
});
export default search;
