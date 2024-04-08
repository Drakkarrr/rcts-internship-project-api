import mongoose from 'mongoose';
const Payment = mongoose.model('Payment');
const Invoice = mongoose.model('Invoice');
const remove = async (req, res) => {
    try {
        const previousPayment = await Payment.findOne({
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
        const result = await Payment.findOneAndUpdate({ _id: req.params.id, removed: false }, { $set: updates }, {
            new: true,
        }).exec();
        let paymentStatus = total - discount === previousCredit - previousAmount
            ? 'paid'
            : previousCredit - previousAmount > 0
                ? 'partially'
                : 'unpaid';
        const updateInvoice = await Invoice.findOneAndUpdate({ _id: invoiceId }, {
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
};
export default remove;
