import mongoose from 'mongoose';
import custom from '@/controllers/pdfController';
import { calculate } from '@/helpers';
import { Request, Response } from 'express';

const Model = mongoose.model('Offer');

const update = async (req: Request, res: Response) => {
  try {
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

    // Calculate the items array with subTotal, total, taxTotal
    items.forEach((item: any) => {
      const itemTotal = calculate.multiply(item['quantity'], item['price']);
      // Sub total
      subTotal = calculate.add(subTotal, itemTotal);
      // Item total
      item['total'] = itemTotal;
    });

    taxTotal = calculate.multiply(subTotal, taxRate / 100);
    total = calculate.add(subTotal, taxTotal);

    let body = req.body;

    body['subTotal'] = subTotal;
    body['taxTotal'] = taxTotal;
    body['total'] = total;
    body['items'] = items;
    body['pdf'] = 'offer-' + req.params.id + '.pdf';

    if (body.hasOwnProperty('currency')) {
      delete body.currency;
    }

    // Find document by id and updates with the required fields
    const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, body, {
      new: true, // return the new result instead of the old one
    }).exec();

    // Returning successful response
    return res.status(200).json({
      success: true,
      result,
      message: 'Document updated successfully',
    });
  } catch (error: string | any) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export default update;
