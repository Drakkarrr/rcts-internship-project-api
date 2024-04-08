import { migrate } from './migrate';
const read = async (Model, req, res) => {
    try {
        const result = await Model.findOne({
            _id: req.params.id,
            removed: false,
        }).exec();
        if (!result) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No document found ',
            });
        }
        else {
            const migratedData = migrate(result);
            return res.status(200).json({
                success: true,
                result: migratedData,
                message: 'we found this document ',
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Internal server error',
        });
    }
};
export default read;
