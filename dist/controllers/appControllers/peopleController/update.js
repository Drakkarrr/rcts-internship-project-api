import mongoose from 'mongoose';
const Client = mongoose.model('Client');
const Lead = mongoose.model('People');
const update = async (Model, req, res) => {
    try {
        req.body.removed = false;
        const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, req.body, {
            new: true,
            runValidators: true,
        }).exec();
        if (!result) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No document found',
            });
        }
        await Client.updateMany({ company: result._id }, { name: `${result.firstname} ${result.lastname}` }).exec();
        await Lead.updateMany({ company: result._id }, { name: `${result.firstname} ${result.lastname}` }).exec();
        return res.status(200).json({
            success: true,
            result,
            message: 'Successfully updated the document',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Internal Server Error',
        });
    }
};
export default update;
