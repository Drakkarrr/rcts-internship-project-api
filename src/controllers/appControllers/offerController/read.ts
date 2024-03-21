import mongoose, { Document } from 'mongoose';

interface OfferDocument extends Document {
  // Define your Offer document fields here
}

const Model = mongoose.model<OfferDocument>('Offer');

const read = async (req: any, res: any) => {
  try {
    // Find document by id
    const result = await Model.findOne({
      _id: req.params.id,
      removed: false,
    })
      .populate('createdBy', 'name')
      .exec();

    // If no results found, return document not found
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found',
      });
    } else {
      // Return success response
      return res.status(200).json({
        success: true,
        result,
        message: 'Document found successfully',
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export default read;
