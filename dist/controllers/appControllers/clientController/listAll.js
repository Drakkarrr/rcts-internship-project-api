import { migrate } from './migrate';
const listAll = async (Model, req, res) => {
    try {
        const sort = parseInt(req.query.sort) || 'desc';
        const result = await Model.find({
            removed: false,
        })
            .sort({ created: sort })
            .populate('')
            .exec();
        const migratedData = result.map((x) => migrate(x));
        if (result.length > 0) {
            res.status(200).json({
                success: true,
                result: migratedData,
                message: 'Successfully found all documents',
            });
        }
        else {
            res.status(203).json({
                success: true,
                result: [],
                message: 'Collection is Empty',
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            result: null,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
export default listAll;
//# sourceMappingURL=listAll.js.map