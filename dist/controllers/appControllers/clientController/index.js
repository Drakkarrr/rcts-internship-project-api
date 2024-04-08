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
    const Model = mongoose.model('Client');
    const methods = createCRUDController('Client');
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
//# sourceMappingURL=index.js.map