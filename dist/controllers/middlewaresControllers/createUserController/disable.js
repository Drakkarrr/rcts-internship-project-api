import mongoose from 'mongoose';
const remove = async (userModel, req, res) => {
    try {
        const User = mongoose.model(userModel);
        const updates = {
            enabled: false,
        };
        // Find the document by id and delete it
        const user = await User.findOne({
            _id: req.params.id,
            removed: false,
        }).exec();
        if (!user) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No document found ',
            });
        }
        if (user.role === 'admin' || user.role === 'owner') {
            return res.status(403).json({
                success: false,
                result: null,
                message: "Can't remove a user with role 'admin'",
            });
        }
        // Find the document by id and delete it
        const result = await User.findOneAndUpdate({ _id: req.params.id, removed: false }, { $set: updates }, {
            new: true, // return the new result instead of the old one
        }).exec();
        if (!result) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No document found ',
            });
        }
        return res.status(200).json({
            success: true,
            result,
            message: 'Successfully deleted the document ',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'An error occurred while deleting the document',
            error: error.message,
        });
    }
};
export default remove;
