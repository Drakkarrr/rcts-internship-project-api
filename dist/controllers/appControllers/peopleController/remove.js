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
const Company = mongoose.model('Company');
const remove = (Model, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // cannot delete client if it has one invoice or is attached to any company
        const { id } = req.params;
        const client = yield Client.findOne({
            people: id,
            removed: false,
        }).exec();
        if (client) {
            return res.status(400).json({
                success: false,
                result: null,
                message: 'Cannot delete person if attached to any company or is a client',
            });
        }
        const company = yield Company.findOne({
            mainContact: id,
            removed: false,
        }).exec();
        if (company) {
            return res.status(400).json({
                success: false,
                result: null,
                message: 'Cannot delete person if attached to any company or is a client',
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
                message: 'No person found with this id: ' + id,
            });
        }
        return res.status(200).json({
            success: true,
            result,
            message: 'Successfully deleted the person with id: ' + id,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Internal Server Error',
        });
    }
});
export default remove;
