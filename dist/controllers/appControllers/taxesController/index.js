import mongoose from 'mongoose';
import createCRUDController from '@/controllers/middlewaresControllers/createCRUDController';
const Model = mongoose.model('Taxes');
const methods = createCRUDController('Taxes');
delete methods['delete'];
methods.create = async (req, res) => {
    try {
        const { isDefault } = req.body;
        if (isDefault) {
            await Model.updateMany({}, { isDefault: false });
        }
        const countDefault = await Model.countDocuments({
            isDefault: true,
        });
        const result = await new Model({
            ...req.body,
            isDefault: countDefault < 1 ? true : false,
        }).save();
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
};
methods.delete = async (req, res) => {
    return res.status(403).json({
        success: false,
        result: null,
        message: "you can't delete tax after it has been created",
    });
};
methods.update = async (req, res) => {
    try {
        const { id } = req.params;
        const tax = await Model.findOne({
            _id: id,
            removed: false,
        }).exec();
        const { isDefault = tax.isDefault, enabled = tax.enabled } = req.body;
        if (!isDefault || (!enabled && isDefault)) {
            await Model.findOneAndUpdate({ _id: { $ne: id }, enabled: true }, { isDefault: true });
        }
        if (isDefault && enabled) {
            await Model.updateMany({ _id: { $ne: id } }, { isDefault: false });
        }
        const taxesCount = await Model.countDocuments({});
        if ((!enabled || !isDefault) && taxesCount <= 1) {
            return res.status(422).json({
                success: false,
                result: null,
                message: 'You cannot disable the tax because it is the only existing one',
            });
        }
        const result = await Model.findOneAndUpdate({ _id: id }, req.body, {
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
};
export default methods;
//# sourceMappingURL=index.js.map