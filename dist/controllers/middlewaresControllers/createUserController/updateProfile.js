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
const updateProfile = (userModel, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const User = mongoose.model(userModel);
    const reqUserName = userModel.toLowerCase();
    const userProfile = req[reqUserName];
    let updates = req.body.photo
        ? {
            email: req.body.email,
            name: req.body.name,
            surname: req.body.surname,
            photo: req.body.photo,
        }
        : {
            email: req.body.email,
            name: req.body.name,
            surname: req.body.surname,
        };
    // Find document by id and updates with the required fields
    const result = yield User.findOneAndUpdate({ _id: userProfile._id, removed: false }, { $set: updates }, {
        new: true, // return the new result instead of the old one
    }).exec();
    if (!result) {
        return res.status(404).json({
            success: false,
            result: null,
            message: 'No profile found by this id: ' + userProfile._id,
        });
    }
    return res.status(200).json({
        success: true,
        result: {
            _id: result === null || result === void 0 ? void 0 : result._id,
            enabled: result === null || result === void 0 ? void 0 : result.enabled,
            email: result === null || result === void 0 ? void 0 : result.email,
            name: result === null || result === void 0 ? void 0 : result.name,
            surname: result === null || result === void 0 ? void 0 : result.surname,
            photo: result === null || result === void 0 ? void 0 : result.photo,
            role: result === null || result === void 0 ? void 0 : result.role,
        },
        message: 'we update this profile by this id: ' + userProfile._id,
    });
});
export default updateProfile;
