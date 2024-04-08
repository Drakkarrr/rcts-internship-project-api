import mongoose from 'mongoose';
export const getData = ({ model }) => {
    const Model = mongoose.model(model);
    const result = Model.find({ removed: false, enabled: true }).exec();
    return result;
};
export const getOne = ({ model, id, }) => {
    const Model = mongoose.model(model);
    const result = Model.findOne({ _id: id, removed: false }).exec();
    return result;
};
//# sourceMappingURL=serverData.js.map