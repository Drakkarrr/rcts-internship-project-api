var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const update = (Model, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find document by id and updates with the required fields
        req.body.removed = false;
        const result = yield Model.findOneAndUpdate({ _id: req.params.id, removed: false }, req.body, {
            new: true,
            runValidators: true,
        }).exec();
        if (!result) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No document found',
            });
        }
        else {
            return res.status(200).json({
                success: true,
                result,
                message: 'Document updated successfully',
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'An error occurred while updating the document',
            error: error.message,
        });
    }
});
export default update;
