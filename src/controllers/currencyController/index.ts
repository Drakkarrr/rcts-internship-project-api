import mongoose, { Model } from 'mongoose';
import createCRUDController from '@/controllers/middlewaresControllers/createCRUDController';
import remove from './remove';
import update from './update';

function modelController() {
  const Model: Model<any> = mongoose.model('Currency');
  const methods = createCRUDController('Currency');

  methods.update = (req: any, res: any) => update(Model, req, res);
  methods.delete = (req: any, res: any) => remove(Model, req, res);

  return methods;
}

export default modelController();
