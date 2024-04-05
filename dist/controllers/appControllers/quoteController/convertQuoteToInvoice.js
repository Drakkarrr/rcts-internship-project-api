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
import moment from 'moment';
const QuoteModel = mongoose.model('Quote');
const InvoiceModel = mongoose.model('Invoice');
const convertQuoteToInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the quote from the database
        const quote = yield QuoteModel.findOne({
            _id: req.params.id,
            removed: false,
        }).exec();
        if (!quote) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'Quote not found',
            });
        }
        // If the quote is already converted, prevent creating another invoice
        if (quote.converted) {
            return res.status(409).json({
                success: false,
                result: null,
                message: 'Quote is already converted to an invoice.',
            });
        }
        // Convert the quote details to invoice details
        const invoiceData = {
            number: quote.number,
            year: quote.year,
            date: moment(),
            expiredDate: moment().add(1, 'month'),
            client: quote.client,
            items: quote.items.map((item) => ({
                itemName: item.itemName,
                description: item.description,
                quantity: item.quantity,
                price: item.price,
                total: item.total,
            })),
            taxRate: quote.taxRate,
            subTotal: quote.subTotal,
            taxTotal: quote.taxTotal,
            total: quote.total,
            credit: quote.credit,
            discount: quote.discount,
            notes: quote.notes,
            createdBy: req.admin._id,
        };
        // invoiceData['createdBy'] = req.admin._id;
        const invoice = yield new InvoiceModel(invoiceData).save();
        quote.converted = true;
        yield quote.save();
        return res.status(200).json({
            success: true,
            result: quote,
            message: 'Successfully converted quote to invoice',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Internal Server Error',
        });
    }
});
export default convertQuoteToInvoice;
