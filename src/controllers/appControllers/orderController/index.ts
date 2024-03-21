import mongoose, { Model } from 'mongoose';
import createCRUDController from '@/controllers/middlewaresControllers/createCRUDController';
import create from './create';
import { Request, Response } from 'express';

function modelController() {
  const modelName = 'Order';
  const Model: Model<any> = mongoose.model(modelName);
  const methods = createCRUDController(modelName);
  methods.create = async (req: Request, res: Response) => {
    try {
      await create(Model, req, res);
    } catch (error: string | any) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  };
  return methods;
}

export default modelController();
