import { loadSettings, increaseBySettingKey } from '@/middlewares/settings';
import { generateUniqueNumber } from '@/middlewares/inventory';
const create = async (Model, req, res) => {
    try {
        let body = req.body;
        body['createdBy'] = req.admin._id;
        const settings = await loadSettings();
        const lastOrderNumber = settings['last_order_number'];
        body.number = generateUniqueNumber(lastOrderNumber);
        // Creating a new document in the collection
        const result = await new Model(body).save();
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
};
export default create;
//# sourceMappingURL=create.js.map