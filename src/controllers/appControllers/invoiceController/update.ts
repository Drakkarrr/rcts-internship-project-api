import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { calculate } from '@/helpers';
import schema from './schemaValidate';

const Model = mongoose.model('Invoice');

interface InvoiceItem {
  _id: string;
  itemName: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

const update = async (req: Request, res: Response): Promise<Response> => {
  let body = req.body;

  const { error, value } = schema.validate(body);
  if (error) {
    const { details } = error;
    return res.status(400).json({
      success: false,
      result: null,
      message: details[0]?.message,
    });
  }

  const previousInvoice = await Model.findOne({
    _id: req.params.id,
    removed: false,
  });

  if (!previousInvoice) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No invoice found with the provided ID',
    });
  }

  const { credit } = previousInvoice;

  const { items = [], taxRate = 0, discount = 0 } = req.body;

  if (items.length === 0) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Items cannot be empty',
    });
  }

  // default
  let subTotal: number | any = 0;
  let taxTotal: number | any = 0;
  let total: number | any = 0;

  //Calculate the items array with subTotal, total, taxTotal
  items.forEach((item: InvoiceItem) => {
    let itemTotal = calculate.multiply(item.quantity, item.price);
    //sub total
    subTotal = calculate.add(subTotal, itemTotal);
    //item total
    item.total = itemTotal as any;
  });
  taxTotal = calculate.multiply(subTotal, taxRate / 100);
  total = calculate.add(subTotal, taxTotal);

  body.subTotal = subTotal;
  body.taxTotal = taxTotal;
  body.total = total;
  body.items = items;
  body.pdf = `invoice-${req.params.id}.pdf`;

  if (body.hasOwnProperty('currency')) {
    delete body.currency;
  }

  let paymentStatus =
    calculate.sub(total, discount) === credit ? 'paid' : credit > 0 ? 'partially' : 'unpaid';
  body.paymentStatus = paymentStatus;

  const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, body, {
    new: true,
  }).exec();

  return res.status(200).json({
    success: true,
    result,
    message: 'Invoice updated successfully',
  });
};

export default update;
