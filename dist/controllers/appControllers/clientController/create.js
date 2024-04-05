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
    try {
        // Creating a new document in the collection
        if (req.body.type === 'people') {
            if (!req.body.people) {
                res.status(403).json({
                    success: false,
                    message: 'Please select a people',
                });
                return;
            }
            else {
                let client = yield Model.findOne({
                    people: req.body.people,
                    removed: false,
                });
                if (client) {
                    res.status(403).json({
                        success: false,
                        result: null,
                        message: 'Client Already Exist',
                    });
                    return;
                }
                let { firstname, lastname } = yield People.findOneAndUpdate({
                    _id: req.body.people,
                    removed: false,
                }, { isClient: true }, {
                    new: true, // return the new result instead of the old one
                    runValidators: true,
                }).exec();
                req.body.name = firstname + ' ' + lastname;
                req.body.company = undefined;
            }
        }
        else {
            if (!req.body.company) {
                res.status(403).json({
                    success: false,
                    message: 'Please select a company',
                });
                return;
            }
            else {
                let client = yield Model.findOne({
                    company: req.body.company,
                    removed: false,
                });
                if (client) {
                    res.status(403).json({
                        success: false,
                        result: null,
                        message: 'Client Already Exist',
                    });
                    return;
                }
                let { name } = yield Company.findOneAndUpdate({
                    _id: req.body.company,
                    removed: false,
                }, { isClient: true }, {
                    new: true, // return the new result instead of the old one
                    runValidators: true,
                }).exec();
                req.body.name = name;
                req.body.people = undefined;
            }
        }
        req.body.removed = false;
        const result = yield new Model(Object.assign({}, req.body)).save();
        // Returning successful response
        res.status(200).json({
            success: true,
            result,
            message: 'Successfully Created the document in Model',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            result: null,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
});
export default create;
