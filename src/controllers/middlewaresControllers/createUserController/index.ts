import { Request, Response } from 'express';
import create from './create';
import read from './read';
import update from './update';
import updateProfile from './updateProfile';
import remove from './remove';
import updatePassword from './updatePassword';
import updateProfilePassword from './updateProfilePassword';
import profile from './profile';
import search from './search';
import filter from './filter';
import listAll from './listAll';
import paginatedList from './paginatedList';

const createUserController = (userModel: string) => {
  let userController: Record<string, (req: Request, res: Response) => void> = {};

  userController.create = (req: Request, res: Response) => create(userModel, req, res);
  userController.updateProfile = (req: Request, res: Response) =>
    updateProfile(userModel, req, res);
  userController.updatePassword = (req: Request, res: Response) =>
    updatePassword(userModel, req, res);
  userController.updateProfilePassword = (req: Request, res: Response) =>
    updateProfilePassword(userModel, req, res);
  userController.profile = (req: Request, res: Response) => profile(userModel, req, res);
  userController.read = (req: Request, res: Response) => read(userModel, req, res);
  userController.update = (req: Request, res: Response) => update(userModel, req, res);
  userController.delete = (req: Request, res: Response) => remove(userModel, req, res);
  userController.list = (req: Request, res: Response) => paginatedList(userModel, req, res);
  userController.listAll = (req: Request, res: Response) => listAll(userModel, req, res);
  userController.search = (req: Request, res: Response) => search(userModel, req, res);
  userController.filter = (req: Request, res: Response) => filter(userModel, req, res);

  return userController;
};

export default createUserController;
