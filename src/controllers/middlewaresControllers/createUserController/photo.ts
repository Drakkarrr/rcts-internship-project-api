import { Request, Response } from 'express';
import mongoose from 'mongoose';

const photo = async (userModel: string, req: Request | any, res: Response) => {
  const User = mongoose.model(userModel);

  const updates: { photo?: string } = {
    photo: req.body.photo,
  };

  try {
    const tmpResult = await User.findOneAndUpdate(
      { _id: req.admin._id, removed: false },
      { $set: updates },
      { new: true, runValidators: true }
    );

    // If no results found, return document not found
    if (!tmpResult) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found ',
      });
    } else {
      // Return success response
      let result = {
        _id: tmpResult._id,
        enabled: tmpResult.enabled,
        email: tmpResult.email,
        name: tmpResult.name,
        surname: tmpResult.surname,
        photo: tmpResult.photo,
        role: tmpResult.role,
      };

      return res.status(200).json({
        success: true,
        result,
        message: 'we update this document photo ',
      });
    }
  } catch (error: unknown | any) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'An error occurred while updating the photo',
      error: error.message,
    });
  }
};

export default photo;
