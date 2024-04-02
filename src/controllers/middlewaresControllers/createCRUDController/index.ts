import { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';

import create from './create';
import read from './read';
import update from './update';
import remove from './remove';
import search from './search';
import filter from './filter';
import summary from './summary';
import listAll from './listAll';
import paginatedList from './paginatedList';

import { modelsFiles } from '@/models/utils';

const createCRUDController = (modelName: string) => {
  if (!modelsFiles.includes(modelName)) {
    throw new Error(`Model ${modelName} does not exist`);
  }

  const Model = mongoose.model(modelName) as Model<any>;
  let crudMethods: Record<string, (req: Request | any, res: Response) => void> = {
    create: (req, res) => create(Model, req, res),
    read: (req, res) => read(Model, req, res),
    update: (req, res) => update(Model, req, res),
    delete: (req, res) => remove(Model, req, res),
    list: (req, res) => paginatedList(Model, req, res),
    listAll: (req, res) => listAll(Model, req, res),
    search: (req, res) => search(Model, req, res),
    filter: (req, res) => filter(Model, req, res),
    summary: (req, res) => summary(Model, req, res),
  };
  return crudMethods;
};

export default createCRUDController;
