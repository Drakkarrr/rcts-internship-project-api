import { Request, Response } from 'express';
import mongoose from 'mongoose';
import createCRUDController from '@/controllers/middlewaresControllers/createCRUDController';
import remove from './remove';
import summary from './summary';
import create from './create';
import read from './read';
import search from './search';
import update from './update';
import listAll from './listAll';
import paginatedList from './paginatedList';

function modelController() {
  const Model: any = mongoose.model('Client');
  const methods: any = createCRUDController('Client');

  methods.read = (req: Request | any, res: Response) => read(Model, req, res);
  methods.delete = (req: Request, res: Response) => remove(Model, req, res);
  methods.list = (req: Request, res: Response) => paginatedList(Model, req, res);
  methods.summary = (req: Request, res: Response) => summary(Model, req, res);
  methods.create = (req: Request, res: Response) => create(Model, req, res);
  methods.update = (req: Request, res: Response) => update(Model, req, res);
  methods.search = (req: Request | any, res: Response) => search(Model, req, res);
  methods.listAll = (req: Request, res: Response) => listAll(Model, req, res);

  return methods;
}

export default modelController();
