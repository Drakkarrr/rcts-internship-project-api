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
const People = mongoose.model('People');
const Company = mongoose.model('Company');
const create = (Model, req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                const { firstname, lastname } = yield People.findOne({
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
                const { name } = yield Company.findOne({
                    _id: reqBody.company,
                    removed: false,
                }).exec();
                reqBody.name = name;
                reqBody.people = null;
            }
        }
        reqBody.removed = false;
        const result = yield new Model(reqBody).save();
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
});
export default create;
