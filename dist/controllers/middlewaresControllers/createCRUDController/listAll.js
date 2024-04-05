var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const listAll = (Model, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sort = req.query.sort || 'desc';
    const enabled = req.query.enabled;
    try {
        let result;
        if (enabled === undefined) {
            result = yield Model.find({
                removed: false,
            })
                .sort({ created: sort })
                .populate('')
                .exec();
        }
        else {
            result = yield Model.find({
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
});
export default listAll;
