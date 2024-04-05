var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Model } from 'mongoose';
const paginatedList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const resultsPromise = Model.find(Object.assign({ removed: false, [filter]: equal }, fields))
            .skip(skip)
            .limit(limit)
            .sort({ [sortBy]: sortValue })
            .populate('createdBy', 'name')
            .exec();
        const countPromise = Model.countDocuments(Object.assign({ removed: false, [filter]: equal }, fields));
        const [result, count] = yield Promise.all([resultsPromise, countPromise]);
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
});
export default paginatedList;
