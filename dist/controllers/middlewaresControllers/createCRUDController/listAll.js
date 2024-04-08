const listAll = async (Model, req, res) => {
    const sort = req.query.sort || 'desc';
    const enabled = req.query.enabled;
    try {
        let result;
        if (enabled === undefined) {
            result = await Model.find({
                removed: false,
            })
                .sort({ created: sort })
                .populate('')
                .exec();
        }
        else {
            result = await Model.find({
                removed: false,
                enabled: enabled,
            })
                .sort({ created: sort })
                .populate('')
                .exec();
        }
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                result,
                message: 'Successfully found all documents',
            });
        }
        else {
            return res.status(203).json({
                success: false,
                result: [],
                message: 'Collection is Empty',
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'An error occurred while fetching documents',
            error: error.message,
        });
    }
};
export default listAll;
