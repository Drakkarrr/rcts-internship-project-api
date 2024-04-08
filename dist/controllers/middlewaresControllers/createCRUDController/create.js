const create = async (Model, req, res) => {
    try {
        req.body.removed = false;
        const result = await new Model({
            ...req.body,
        }).save();
        return res.status(200).json({
            success: true,
            result,
            message: 'Successfully Created the document in Model ',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Failed to create document',
        });
    }
};
export default create;
//# sourceMappingURL=create.js.map