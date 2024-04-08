import { Model } from 'mongoose';
const paginatedList = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page.toString()) : 1;
    const limit = req.query.items ? parseInt(req.query.items.toString()) : 10;
    const skip = (page - 1) * limit;
    const { sortBy = 'enabled', sortValue = -1, filter, equal } = req.query;
    const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];
    let fields = {};
    if (fieldsArray.length > 0) {
        fields.$or = fieldsArray.map((field) => ({
            [field]: { $regex: new RegExp(req.query.q, 'i') },
        }));
    }
    try {
        const resultsPromise = Model.find({ removed: false, [filter]: equal, ...fields })
            .skip(skip)
            .limit(limit)
            .sort({ [sortBy]: sortValue })
            .populate('createdBy', 'name')
            .exec();
        const countPromise = Model.countDocuments({ removed: false, [filter]: equal, ...fields });
        const [result, count] = await Promise.all([resultsPromise, countPromise]);
        const pages = Math.ceil(count / limit);
        const pagination = { page, pages, count };
        if (count > 0) {
            return res.status(200).json({
                success: true,
                result,
                pagination,
                message: 'Successfully found all documents',
            });
        }
        else {
            return res.status(203).json({
                success: true,
                result: [],
                pagination,
                message: 'Collection is Empty',
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Internal Server Error',
        });
    }
};
export default paginatedList;
//# sourceMappingURL=paginatedList.js.map