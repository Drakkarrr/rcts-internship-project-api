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
const Model = mongoose.model('Invoice');
const ModalPayment = mongoose.model('Payment');
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedInvoice = yield Model.findOneAndUpdate({
            _id: req.params.id,
            removed: false,
        }, {
            $set: {
                removed: true,
            },
        }).exec();
        if (!deletedInvoice) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'Invoice not found',
            });
        }
        const paymentsInvoices = yield ModalPayment.updateMany({ invoice: deletedInvoice._id }, { $set: { removed: true } });
        return res.status(200).json({
            success: true,
            result: deletedInvoice,
            message: 'Invoice deleted successfully',
        });
    }
    catch (error) {
        // Handle error
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Internal server error',
        });
    }
});
export default remove;
