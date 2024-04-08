import mongoose from 'mongoose';
const Model = mongoose.model('Setting');
const listAll = async (req, res) => {
    try {
        const sort = parseInt(req.query.sort) || 'desc';
        const result = await Model.find({
            removed: false,
            isPrivate: false,
        }).sort({ created: sort });
        if (result.length > 0) {
            res.status(200).json({
                success: true,
                result,
                message: 'Successfully found all documents',
            });
        }
        else {
            res.status(203).json({
                success: false,
                result: [],
                message: 'Collection is Empty',
            });
        }
    }
    catch (error) {
        console.error('Error in listAll:', error);
        res.status(500).json({
            success: false,
            result: null,
            message: 'Internal Server Error',
        });
    }
};
export default listAll;
//# sourceMappingURL=listAll.js.map