import mongoose, { Model } from 'mongoose';
import { Request, Response } from 'express';

const Client = mongoose.model('Client');
const People = mongoose.model('People');

const remove = async (Model: Model<any>, req: Request, res: Response) => {
  // cannot delete client if it has one invoice or client:
  // check if client has invoice or client:
  const { id } = req.params;

  // first find if there is at least one client or person attached to the company
  const client = await Client.findOne({
    company: id,
    removed: false,
  }).exec();
  if (client) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Cannot delete company if company is attached to any people or if it is a client',
    });
  }
  const people = await People.findOne({
    company: id,
    removed: false,
  }).exec();
  if (people) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Cannot delete company if company is attached to any people or if it is a client',
    });
  }

  // if no people or client, delete the company
  const result = await Model.findOneAndUpdate(
    { _id: id, removed: false },
    {
      $set: {
        removed: true,
      },
    }
  ).exec();
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No people found by this id: ' + id,
    });
  }
  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully deleted the people by id: ' + id,
  });
};

export default remove;
