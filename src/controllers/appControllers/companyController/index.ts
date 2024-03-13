import mongoose, { Model } from 'mongoose';
import { Request, Response } from 'express';
import { modelsFiles } from '@/models/utils';
import createCRUDController from '@/controllers/middlewaresControllers/createCRUDController';

import remove from './remove';
import update from './update';

function modelController() {
  const modelName = 'Company';

  if (!modelsFiles.includes(modelName)) {
    throw new Error(`Model ${modelName} does not exist`);
  } else {
    const Model: Model<any> = mongoose.model(modelName);
    const methods = createCRUDController(modelName);

    methods.delete = (req: Request, res: Response) => remove(Model, req, res);
    methods.update = (req: Request, res: Response) => update(Model, req, res);

    return methods;
  }
}

export default modelController();
