import mongoose from 'mongoose';
import createCRUDController from '@/controllers/middlewaresControllers/createCRUDController';
import remove from './remove';
import update from './update';
function modelController() {
    const Model = mongoose.model('Currency');
    const methods = createCRUDController('Currency');
    methods.update = (req, res) => update(Model, req, res);
    methods.delete = (req, res) => remove(Model, req, res);
    return methods;
}
export default modelController();
//# sourceMappingURL=index.js.map