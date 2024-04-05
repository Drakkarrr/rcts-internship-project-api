var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const summary = (Model, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Query the database for a count of all documents
        const countAllDocsPromise = Model.countDocuments({ removed: false });
        // Query the database for a count of filtered documents
        const countFilterPromise = Model.countDocuments({
            removed: false,
            [req.query.filter]: req.query.equal,
        }).exec();
        // Resolving both promises
        const [countFilter, countAllDocs] = yield Promise.all([
            countFilterPromise,
            countAllDocsPromise,
        ]);
        if (countAllDocs > 0) {
            return res.status(200).json({
                success: true,
                result: { countFilter, countAllDocs },
                message: 'Successfully counted all documents',
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
            message: 'An error occurred while summarizing documents',
            error: error.message,
        });
    }
});
export default summary;
