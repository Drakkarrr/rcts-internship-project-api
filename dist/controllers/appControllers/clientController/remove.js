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
const QuoteModel = mongoose.model('Quote');
const InvoiceModel = mongoose.model('Invoice');
const People = mongoose.model('People');
const Company = mongoose.model('Company');
const remove = (Model, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if the client has any associated quotes or invoices
        const [quote, invoice] = yield Promise.all([
            QuoteModel.findOne({ client: id, removed: false }).exec(),
            InvoiceModel.findOne({ client: id, removed: false }).exec(),
        ]);
        if (quote || invoice) {
            return res.status(400).json({
                success: false,
                result: null,
                message: 'Cannot delete client if they have any associated quotes or invoices',
            });
        }
        // Remove the client from the Model
        const result = yield Model.findOneAndDelete({ _id: id, removed: false }).exec();
        if (!result) {
            return res.status(404).json({
                success: false,
                result: null,
                message: `No client found with id: ${id}`,
            });
        }
        // Update isClient flag for People or Company
        const updateQuery = result.type === 'people' ? { isClient: false } : { isClient: false };
        yield (result.type === 'people' ? People : Company)
            .findOneAndUpdate({ _id: result[result.type]._id, removed: false }, updateQuery, {
            new: true,
            runValidators: true,
        })
            .exec();
        return res.status(200).json({
            success: true,
            result: null,
            message: `Successfully deleted the client with id: ${id}`,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Internal server error',
        });
    }
});
export default remove;
