import { Request, Response } from 'express';
import mongoose from 'mongoose';
import createCRUDController from '@/controllers/middlewaresControllers/createCRUDController';
import read from './read';
import remove from './remove';
import update from './update';
import paginatedList from './paginatedList';

function modelController() {
  const Model = mongoose.model('People');
  const methods = createCRUDController('People');

  methods.read = (req: Request, res: Response) => read(Model, req, res);
  methods.update = (req: Request, res: Response) => update(Model, req, res);
  methods.delete = (req: Request, res: Response) => remove(Model, req, res);
  methods.list = (req: Request, res: Response) => paginatedList(Model, req, res);

  return methods;
}

export default modelController();
