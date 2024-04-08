import mongoose, { Document, Model } from 'mongoose';

interface IDataResult extends Document {
  removed: boolean;
  enabled: boolean;
}

export const getData = <T extends IDataResult>({ model }: { model: string }): Promise<T[]> => {
  const Model: Model<T> = mongoose.model<T>(model);
  const result: Promise<T[]> = Model.find({ removed: false, enabled: true } as any).exec();
  return result;
};

export const getOne = <T extends IDataResult>({
  model,
  id,
}: {
  model: string;
  id: string;
}): Promise<T | null> => {
  const Model: Model<T> = mongoose.model<T>(model);
  const result: Promise<T | null> = Model.findOne({ _id: id, removed: false } as any).exec();
  return result;
};
