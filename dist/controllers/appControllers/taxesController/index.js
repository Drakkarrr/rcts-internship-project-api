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
import createCRUDController from '@/controllers/middlewaresControllers/createCRUDController';
const Model = mongoose.model('Taxes');
const methods = createCRUDController('Taxes');
delete methods['delete'];
methods.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isDefault } = req.body;
        if (isDefault) {
            yield Model.updateMany({}, { isDefault: false });
        }
        const countDefault = yield Model.countDocuments({
            isDefault: true,
        });
        const result = yield new Model(Object.assign(Object.assign({}, req.body), { isDefault: countDefault < 1 ? true : false })).save();
        return res.status(200).json({
            success: true,
            result,
            message: 'Tax created successfully',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Internal Server Error',
        });
    }
});
methods.delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(403).json({
        success: false,
        result: null,
        message: "you can't delete tax after it has been created",
    });
});
methods.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const tax = yield Model.findOne({
            _id: id,
            removed: false,
        }).exec();
        const { isDefault = tax.isDefault, enabled = tax.enabled } = req.body;
        if (!isDefault || (!enabled && isDefault)) {
            yield Model.findOneAndUpdate({ _id: { $ne: id }, enabled: true }, { isDefault: true });
        }
        if (isDefault && enabled) {
            yield Model.updateMany({ _id: { $ne: id } }, { isDefault: false });
        }
        const taxesCount = yield Model.countDocuments({});
        if ((!enabled || !isDefault) && taxesCount <= 1) {
            return res.status(422).json({
                success: false,
                result: null,
                message: 'You cannot disable the tax because it is the only existing one',
            });
        }
        const result = yield Model.findOneAndUpdate({ _id: id }, req.body, {
            new: true,
        });
        return res.status(200).json({
            success: true,
            message: 'Tax updated successfully',
            result,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Internal Server Error',
        });
    }
});
export default methods;
