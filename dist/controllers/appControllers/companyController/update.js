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
const Client = mongoose.model('Client');
const Lead = mongoose.model('People');
const update = (Model, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.removed = false;
    const result = yield Model.findOneAndUpdate({ _id: req.params.id, removed: false }, req.body, {
        new: true,
        runValidators: true,
    }).exec();
    if (!result) {
        return res.status(404).json({
            success: false,
            result: null,
            message: 'No document found ',
        });
    }
    else {
        yield Client.findOneAndUpdate({ company: result._id }, { name: result.name }, {
            new: true,
        }).exec();
        yield Lead.findOneAndUpdate({ company: result._id }, { name: result.name }, {
            new: true,
        }).exec();
        return res.status(200).json({
            success: true,
            result,
            message: 'We updated this document ',
        });
    }
});
export default update;
