const update = async (Model, req, res) => {
    try {
        if (req.body.type === 'people') {
            if (!req.body.people) {
                return res.status(403).json({
                    success: false,
                    message: 'Please select a people',
                });
            }
            else {
                const { firstname, lastname } = await Model.findOne({
                    _id: req.body.people,
                    removed: false,
                }).exec();
                req.body.name = `${firstname} ${lastname}`;
                req.body.company = null;
            }
        }
        else {
            if (!req.body.company) {
                return res.status(403).json({
                    success: false,
                    message: 'Please select a company',
                });
            }
            else {
                const { name } = await Model.findOne({
                    _id: req.body.company,
                    removed: false,
                }).exec();
                req.body.name = name;
                req.body.people = null;
            }
        }
        req.body.removed = false;
        const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, req.body, {
            new: true, // return the new result instead of the old one
            runValidators: true,
        }).exec();
        if (!result) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No document found ',
            });
        }
        else {
            return res.status(200).json({
                success: true,
                result,
                message: 'we update this document ',
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
export default update;
