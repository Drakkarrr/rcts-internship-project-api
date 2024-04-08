import mongoose from 'mongoose';
const People = mongoose.model('People');
const Company = mongoose.model('Company');
const create = async (Model, req, res) => {
    const reqBody = req.body;
    try {
        if (reqBody.type === 'people') {
            if (!reqBody.people) {
                return res.status(403).json({
                    success: false,
                    message: 'Please select a people',
                });
            }
            else {
                const { firstname, lastname } = await People.findOne({
                    _id: reqBody.people,
                    removed: false,
                }).exec();
                reqBody.name = `${firstname} ${lastname}`;
                reqBody.company = null;
            }
        }
        else {
            if (!reqBody.company) {
                return res.status(403).json({
                    success: false,
                    message: 'Please select a company',
                });
            }
            else {
                const { name } = await Company.findOne({
                    _id: reqBody.company,
                    removed: false,
                }).exec();
                reqBody.name = name;
                reqBody.people = null;
            }
        }
        reqBody.removed = false;
        const result = await new Model(reqBody).save();
        return res.status(200).json({
            success: true,
            result,
            message: 'Successfully Created the document in Model',
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
