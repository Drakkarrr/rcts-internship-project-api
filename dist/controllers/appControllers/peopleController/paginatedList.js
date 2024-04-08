const paginatedList = async (Model, req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.items ? parseInt(req.query.items) : 10;
    const skip = page * limit - limit;
    const { sortBy = 'enabled', sortValue = -1, filter, equal } = req.query;
    const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];
    let fields;
    fields = fieldsArray.length === 0 ? {} : { $or: [] };
    for (const field of fieldsArray) {
        fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
    }
    try {
        // Query the database for a list of all results
        const resultsPromise = Model.find({
            removed: false,
            [filter]: equal,
            ...fields,
        })
            .skip(skip)
            .limit(limit)
            .sort({ [sortBy]: sortValue })
            .populate('company', 'name')
            .exec();
        // Counting the total documents
        const countPromise = Model.countDocuments({
            removed: false,
            [filter]: equal,
            ...fields,
        });
        // Resolving both promises
        const [result, count] = await Promise.all([resultsPromise, countPromise]);
        // Calculating total pages
        const pages = Math.ceil(count / limit);
        // Getting Pagination Object
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
