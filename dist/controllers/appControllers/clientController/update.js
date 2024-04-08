const update = async (Model, req, res) => {
    return res.status(200).json({
        success: false,
        result: null,
        message: 'You cant update client once it is created',
    });
};
export default update;
