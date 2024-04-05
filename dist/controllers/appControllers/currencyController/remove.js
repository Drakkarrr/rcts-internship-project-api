var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const remove = (Model, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // cannot delete client if it has one invoice or Client:
    // check if client has invoice or quotes:
    return res.status(400).json({
        success: false,
        result: null,
        message: 'Cannot remove currency after it was created',
    });
});
export default remove;
