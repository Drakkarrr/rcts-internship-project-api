import mongoose from 'mongoose';
import createCRUDController from '@/controllers/middlewaresControllers/createCRUDController';
import read from './read';
import remove from './remove';
import update from './update';
import paginatedList from './paginatedList';
function modelController() {
    const Model = mongoose.model('People');
    const methods = createCRUDController('People');
    methods.read = (req, res) => read(Model, req, res);
    methods.update = (req, res) => update(Model, req, res);
    methods.delete = (req, res) => remove(Model, req, res);
    methods.list = (req, res) => paginatedList(Model, req, res);
    return methods;
}
export default modelController();
//# sourceMappingURL=index.js.map