import { migrate } from './migrate';
const search = async (Model, req, res) => {
    try {
        const fieldsArray = req.query.fields ? req.query.fields.split(',') : ['name'];
        const fields = { $or: [] };
        for (const field of fieldsArray) {
            fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
        }
        let results = await Model.find({
            ...fields,
        })
            .where('removed')
            .equals(false)
            .limit(20)
            .exec();
        const migratedData = results.map((x) => migrate(x));
        if (results.length >= 1) {
            return res.status(200).json({
                success: true,
                result: migratedData,
                message: 'Successfully found all documents',
            });
        }
        else {
            return res.status(202).json({
                success: false,
                result: [],
                message: 'No document found by this request',
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
export default search;
//# sourceMappingURL=search.js.map