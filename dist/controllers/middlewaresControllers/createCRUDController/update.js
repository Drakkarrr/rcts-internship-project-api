const update = async (Model, req, res) => {
    try {
        // Find document by id and updates with the required fields
        req.body.removed = false;
        const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, req.body, {
            new: true,
            runValidators: true,
        }).exec();
        if (!result) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No document found',
            });
        }
        else {
            return res.status(200).json({
                success: true,
                result,
                message: 'Document updated successfully',
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'An error occurred while updating the document',
            error: error.message,
        });
    }
};
export default update;
