import { migrate } from './migrate';
const paginatedList = async (Model, req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.items, 10) || 10;
    const skip = page * limit - limit;
    const { sortBy = 'enabled', sortValue = -1, filter, equal } = req.query;
    const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];
    let fields = fieldsArray.length === 0 ? {} : { $or: [] };
    for (const field of fieldsArray) {
        fields.$or?.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
    }
    const resultsPromise = await Model.find({
        removed: false,
        [filter]: equal,
        ...fields,
    })
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortValue })
        .populate('')
        .exec();
    const countPromise = Model.countDocuments({
        removed: false,
        [filter]: equal,
        ...fields,
    });
    const [result, count] = await Promise.all([resultsPromise, countPromise]);
    const pages = Math.ceil(count / limit);
    const pagination = { page, pages, count };
    if (count > 0) {
        const migratedData = result.map((x) => migrate(x));
        const response = {
            success: true,
            result: migratedData,
            pagination,
            message: 'Successfully found all documents',
        };
        return res.status(200).json(response);
    }
    else {
        const response = {
            success: true,
            result: [],
            pagination,
            message: 'Collection is Empty',
        };
        return res.status(203).json(response);
    }
};
export default paginatedList;
