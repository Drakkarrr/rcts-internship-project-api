import { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';

const Client = mongoose.model('Client');
const Lead = mongoose.model('People');

const update = async (Model: Model<any>, req: Request, res: Response) => {
  try {
    // Find document by id and update with the required fields
    req.body.removed = false;
    const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, req.body, {
      new: true, // return the new result instead of the old one
      runValidators: true,
    }).exec();

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found',
      });
    }

    // Update related clients and leads with the new name
    await Client.updateMany(
      { company: result._id },
      { name: `${result.firstname} ${result.lastname}` }
    ).exec();

    await Lead.updateMany(
      { company: result._id },
      { name: `${result.firstname} ${result.lastname}` }
    ).exec();

    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully updated the document',
    });
  } catch (error: string | any) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Internal Server Error',
    });
  }
};

export default update;
