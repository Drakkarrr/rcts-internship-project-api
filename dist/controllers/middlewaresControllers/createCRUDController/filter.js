var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const filter = (Model, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.query.filter === undefined || req.query.equal === undefined) {
            return res.status(403).json({
                success: false,
                result: null,
                message: 'filter not provided correctly',
            });
        }
        const result = yield Model.find({
            removed: false,
        })
            .where(req.query.filter)
            .equals(req.query.equal)
            .exec();
        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No document found ',
            });
        }
        else {
            // Return success response
            return res.status(200).json({
                success: true,
                result,
                message: 'Successfully found all documents',
            });
        }
    }
    catch (error) {
        // Handle errors
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Failed to filter documents',
        });
    }
});
export default filter;
