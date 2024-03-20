import mongoose, { Model } from 'mongoose';
import createCRUDController from '@/controllers/middlewaresControllers/createCRUDController';
import remove from './remove';
import summary from './summary';
import create from './create';
import update from './update';
import read from './read';
import search from './search';
import listAll from './listAll';
import paginatedList from './paginatedList';

interface CRUDMethods {
  read: (req: any, res: any) => void;
  delete: (req: any, res: any) => void;
  list: (req: any, res: any) => void;
  summary: (req: any, res: any) => void;
  create: (req: any, res: any) => void;
  update: (req: any, res: any) => void;
  search: (req: any, res: any) => void;
  listAll: (req: any, res: any) => void;
}

function modelController() {
  const modelName: string = 'Lead';
  const Model: Model<any> = mongoose.model(modelName);
  const methods: CRUDMethods = createCRUDController(modelName);
  methods.read = (req, res) => read(Model, req, res);
  methods.delete = (req, res) => remove(Model, req, res);
  methods.list = (req, res) => paginatedList(Model, req, res);
  methods.summary = (req, res) => summary(Model, req, res);
  methods.create = (req, res) => create(Model, req, res);
  methods.update = (req, res) => update(Model, req, res);
  methods.search = (req, res) => search(Model, req, res);
  methods.listAll = (req, res) => listAll(Model, req, res);
  return methods;
}

export default modelController();
