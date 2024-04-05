var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from 'mongoose';
const Offer = mongoose.model('Offer');
const remove = (Model, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const offerQuotes = yield Offer.findOne({
            lead: id,
            removed: false,
        }).exec();
        if (offerQuotes) {
            return res.status(400).json({
                success: false,
                result: null,
                message: 'Cannot delete lead if lead have offer',
            });
        }
        const result = yield Model.findOneAndDelete({
            _id: id,
            removed: false,
        }).exec();
        if (!result) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No client found by this id: ' + id,
            });
        }
        return res.status(200).json({
            success: true,
            result: null,
            message: 'Successfully Deleted the client by id: ' + id,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Internal server error',
        });
    }
});
export default remove;
