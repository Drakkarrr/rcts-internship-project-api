import createCRUDController from '@/controllers/middlewaresControllers/createCRUDController';
import { routesList } from '@/models/utils';
import { globSync } from 'glob';
import path from 'path';

const pattern = './src/controllers/appControllers/*/**/';
const controllerDirectories = globSync(pattern).map((filePath) => {
  return path.basename(filePath);
});

const appControllers = () => {
  const controllers: any = {};
  const hasCustomControllers: string[] = [];

  controllerDirectories.forEach((controllerName: string) => {
    try {
      const customController = require('@/controllers/appControllers/' + controllerName);

      if (customController) {
        hasCustomControllers.push(controllerName);
        controllers[controllerName] = customController;
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
  });

  routesList.forEach(({ modelName, controllerName }) => {
    if (!hasCustomControllers.includes(controllerName)) {
      controllers[controllerName] = createCRUDController(modelName);
    }
  });

  return controllers;
};

export default appControllers();
