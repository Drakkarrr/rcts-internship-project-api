var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const search = (Model, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fieldsArray = req.query.fields ? req.query.fields.split(',') : ['name'];
        const fields = { $or: [] };
        for (const field of fieldsArray) {
            fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
        }
        const results = yield Model.find(Object.assign(Object.assign({}, fields), { removed: false }))
            .limit(20)
            .exec();
        if (results.length >= 1) {
            return res.status(200).json({
                success: true,
                result: results,
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
            message: 'An error occurred while searching for documents',
            error: error.message,
        });
    }
});
export default search;
