var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from 'mongoose';
import createCRUDController from '@/controllers/middlewaresControllers/createCRUDController';
import create from './create';
function modelController() {
    const modelName = 'Order';
    const Model = mongoose.model(modelName);
    const methods = createCRUDController(modelName);
    methods.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield create(Model, req, res);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message,
            });
        }
    });
    return methods;
}
export default modelController();
