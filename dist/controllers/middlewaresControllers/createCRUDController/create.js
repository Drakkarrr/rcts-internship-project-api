var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const create = (Model, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.removed = false;
        const result = yield new Model(Object.assign({}, req.body)).save();
        return res.status(200).json({
            success: true,
            result,
            message: 'Successfully Created the document in Model ',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Failed to create document',
        });
    }
});
export default create;
