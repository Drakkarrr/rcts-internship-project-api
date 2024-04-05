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
const Payment = mongoose.model('Payment');
const Invoice = mongoose.model('Invoice');
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const previousPayment = yield Payment.findOne({
            _id: req.params.id,
            removed: false,
        });
        if (!previousPayment) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No document found ',
            });
        }
        const { _id: paymentId, amount: previousAmount } = previousPayment;
        const { id: invoiceId, total, discount, credit: previousCredit } = previousPayment.invoice;
        let updates = {
            removed: true,
        };
        const result = yield Payment.findOneAndUpdate({ _id: req.params.id, removed: false }, { $set: updates }, {
            new: true,
        }).exec();
        let paymentStatus = total - discount === previousCredit - previousAmount
            ? 'paid'
            : previousCredit - previousAmount > 0
                ? 'partially'
                : 'unpaid';
        const updateInvoice = yield Invoice.findOneAndUpdate({ _id: invoiceId }, {
            $pull: {
                payment: paymentId,
            },
            $inc: { credit: -previousAmount },
            $set: {
                paymentStatus: paymentStatus,
            },
        }, {
            new: true,
        }).exec();
        return res.status(200).json({
            success: true,
            result,
            message: 'Successfully Deleted the document ',
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Internal Server Error',
        });
    }
});
export default remove;
