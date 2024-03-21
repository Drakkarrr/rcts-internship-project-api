import { Request, Response } from 'express';
import mongoose, { Document } from 'mongoose';

const Offer = mongoose.model('Offer');

const remove = async (Model: any, req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const offerQuotes: Document | null = await Offer.findOne({
      lead: id,
      removed: false,
    }).exec();

    if (offerQuotes) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Cannot delete lead if lead have offer',
      });
    }

    const result: Document | null = await Model.findOneAndDelete({
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

    return res.status(200).json({
      success: true,
      result: null,
      message: 'Successfully Deleted the client by id: ' + id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
    });
  }
};

export default remove;
