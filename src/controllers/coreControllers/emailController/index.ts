import createCRUDController, {
  CRUDController,
} from '@/controllers/middlewaresControllers/createCRUDController';

const crudController: CRUDController = createCRUDController('Email');

const emailMethods = {
  create: crudController.create,
  read: crudController.read,
  update: crudController.update,
  list: crudController.list,
  listAll: crudController.listAll,
  filter: crudController.filter,
  search: crudController.search,
};

export default emailMethods;
