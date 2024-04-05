var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { migrate } from './migrate';
const paginatedList = (Model, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.items, 10) || 10;
    const skip = page * limit - limit;
    const { sortBy = 'enabled', sortValue = -1, filter, equal } = req.query;
    const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];
    let fields = fieldsArray.length === 0 ? {} : { $or: [] };
    for (const field of fieldsArray) {
        (_a = fields.$or) === null || _a === void 0 ? void 0 : _a.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
    }
    const resultsPromise = yield Model.find(Object.assign({ removed: false, [filter]: equal }, fields))
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortValue })
        .populate('')
        .exec();
    const countPromise = Model.countDocuments(Object.assign({ removed: false, [filter]: equal }, fields));
    const [result, count] = yield Promise.all([resultsPromise, countPromise]);
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
});
export default paginatedList;
