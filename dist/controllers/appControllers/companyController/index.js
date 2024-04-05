import mongoose from 'mongoose';
import { modelsFiles } from '@/models/utils';
import createCRUDController from '@/controllers/middlewaresControllers/createCRUDController';
import remove from './remove';
import update from './update';
function modelController() {
    const modelName = 'Company';
    if (!modelsFiles.includes(modelName)) {
        throw new Error(`Model ${modelName} does not exist`);
    }
    else {
        const Model = mongoose.model(modelName);
        const methods = createCRUDController(modelName);
        methods.delete = (req, res) => remove(Model, req, res);
        methods.update = (req, res) => update(Model, req, res);
        return methods;
    }
}
export default modelController();
