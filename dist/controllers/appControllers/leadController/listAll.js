import { migrate } from './migrate';
const listAll = async (Model, req, res) => {
    try {
        const sort = parseInt(req.query.sort) || 'desc';
        //  Query the database for a list of all results
        const result = await Model.find({
            removed: false,
        })
            .sort({ created: sort })
            .populate()
            .exec();
        const migratedData = result.map((x) => migrate(x));
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                result: migratedData,
                message: 'Successfully found all documents',
            });
        }
        else {
            return res.status(203).json({
                success: true,
                result: [],
                message: 'Collection is Empty',
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Internal server error',
        });
    }
};
export default listAll;
//# sourceMappingURL=listAll.js.map