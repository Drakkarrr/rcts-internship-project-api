import mongoose from 'mongoose';
import createCRUDController from '@/controllers/middlewaresControllers/createCRUDController';
import create from './create';
function modelController() {
    const modelName = 'Order';
    const Model = mongoose.model(modelName);
    const methods = createCRUDController(modelName);
    methods.create = async (req, res) => {
        try {
            await create(Model, req, res);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message,
            });
        }
    };
    return methods;
}
export default modelController();
