import mongoose from 'mongoose';
const Client = mongoose.model('Client');
const Company = mongoose.model('Company');
const remove = async (Model, req, res) => {
    try {
        // cannot delete client if it has one invoice or is attached to any company
        const { id } = req.params;
        const client = await Client.findOne({
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
        const company = await Company.findOne({
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
        const result = await Model.findOneAndUpdate({ _id: id, removed: false }, {
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
};
export default remove;
