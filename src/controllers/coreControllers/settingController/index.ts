import createCRUDController, {
  CRUDController,
} from '@/controllers/middlewaresControllers/createCRUDController';
import listBySettingKey from './listBySettingKey';
import readBySettingKey from './readBySettingKey';
import updateBySettingKey from './updateBySettingKey';
import updateManySetting from './updateManySetting';
import listAll from './listAll';

const crudController: CRUDController = createCRUDController('Setting');

const settingMethods = {
  read: crudController.read,
  create: crudController.create,
  update: crudController.update,
  list: crudController.list,
  filter: crudController.filter,
  search: crudController.search,
  listAll,
  listBySettingKey,
  readBySettingKey,
  updateBySettingKey,
  updateManySetting,
};

export default settingMethods;
