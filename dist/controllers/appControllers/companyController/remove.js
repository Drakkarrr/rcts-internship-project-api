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
const People = mongoose.model('People');
const remove = (Model, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const client = yield Client.findOne({
        company: id,
        removed: false,
    }).exec();
    if (client) {
        return res.status(400).json({
            success: false,
            result: null,
            message: 'Cannot delete company if company is attached to any people or if it is a client',
        });
    }
    const people = yield People.findOne({
        company: id,
        removed: false,
    }).exec();
    if (people) {
        return res.status(400).json({
            success: false,
            result: null,
            message: 'Cannot delete company if company is attached to any people or if it is a client',
        });
    }
    const result = yield Model.findOneAndUpdate({ _id: id, removed: false }, {
        $set: {
            removed: true,
        },
    }).exec();
    if (!result) {
        return res.status(404).json({
            success: false,
            result: null,
            message: 'No people found by this id: ' + id,
        });
    }
    return res.status(200).json({
        success: true,
        result,
        message: 'Successfully deleted the people by id: ' + id,
    });
});
export default remove;
