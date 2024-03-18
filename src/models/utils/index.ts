import { basename, extname } from 'path';
import { globSync } from 'glob';

const appModelsFiles = globSync('./src/models/appModels/**/*.js');

const pattern = './src/models/**/*.js';

const modelsFiles = globSync(pattern).map((filePath: string) => {
  const fileNameWithExtension = basename(filePath);
  const fileNameWithoutExtension = fileNameWithExtension.replace(
    extname(fileNameWithExtension),
    ''
  );
  return fileNameWithoutExtension;
});

const controllersList: string[] = [];
const appModelsList: string[] = [];
const entityList: string[] = [];
const routesList: { entity: string; modelName: string; controllerName: string }[] = [];

for (const filePath of appModelsFiles) {
  const fileNameWithExtension = basename(filePath);
  const fileNameWithoutExtension = fileNameWithExtension.replace(
    extname(fileNameWithExtension),
    ''
  );
  const firstChar = fileNameWithoutExtension.charAt(0);
  const modelName = fileNameWithoutExtension.replace(firstChar, firstChar.toUpperCase());
  const fileNameLowerCaseFirstChar = fileNameWithoutExtension.replace(
    firstChar,
    firstChar.toLowerCase()
  );
  const entity = fileNameWithoutExtension.toLowerCase();

  const controllerName = fileNameLowerCaseFirstChar + 'Controller';
  controllersList.push(controllerName);
  appModelsList.push(modelName);
  entityList.push(entity);

  const route = {
    entity: entity,
    modelName: modelName,
    controllerName: controllerName,
  };
  routesList.push(route);
}

export { controllersList, appModelsList, modelsFiles, entityList, routesList };
