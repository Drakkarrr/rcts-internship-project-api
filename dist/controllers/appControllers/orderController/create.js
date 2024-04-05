var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadSettings, increaseBySettingKey } from '@/middlewares/settings';
import { generateUniqueNumber } from '@/middlewares/inventory';
const create = (Model, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        body['createdBy'] = req.admin._id;
        const settings = yield loadSettings();
        const lastOrderNumber = settings['last_order_number'];
        body.number = generateUniqueNumber(lastOrderNumber);
        // Creating a new document in the collection
        const result = yield new Model(body).save();
        // Incrementing last_order_number setting
        increaseBySettingKey({
            settingKey: 'last_order_number',
        });
        // Returning successful response
        return res.status(200).json({
            success: true,
            result,
            message: 'Order created successfully',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
});
export default create;
