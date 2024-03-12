import { Request, Response } from 'express';
import { Model, Document } from 'mongoose';

interface QueryParams {
  id: string;
}

const remove = async (
  Model: Model<Document>,
  req: Request<{}, {}, {}, QueryParams> | any,
  res: Response
) => {
  const { id } = req.params;

  const resultQuotes = Model.findOne({
    client: id,
    removed: false,
  }).exec();
  const resultInvoice = Model.findOne({
    client: id,
    removed: false,
  }).exec();

  const [quotes, invoice] = await Promise.allSettled([resultQuotes, resultInvoice]);

  if (quotes.status === 'fulfilled' && quotes.value) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Cannot delete client if it has any quote or invoice',
    });
  }

  if (invoice.status === 'fulfilled' && invoice.value) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Cannot delete client if it has any quote or invoice',
    });
  }

  let result: any = await Model.findOneAndDelete({
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

  if (result.type === 'people') {
    await Model.findOneAndUpdate(
      {
        _id: result.people?._id,
        removed: false,
      },
      { isClient: false },
      {
        new: true,
        runValidators: true,
      }
    ).exec();
  } else {
    await Model.findOneAndUpdate(
      {
        _id: result.company?._id,
        removed: false,
      },
      { isClient: false },
      {
        new: true,
        runValidators: true,
      }
    ).exec();
  }

  return res.status(200).json({
    success: true,
    result: null,
    message: 'Successfully Deleted the client by id: ' + id,
  });
};

export default remove;
