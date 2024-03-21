import createCRUDController from '@/controllers/middlewaresControllers/createCRUDController';
import create from './create';
import summary from './summary';
import update from './update';
import paginatedList from './paginatedList';
import read from './read';
import sendMail from './sendMail';

const methods = createCRUDController('Offer');

methods.list = paginatedList;
methods.read = read;
methods.mail = sendMail;
methods.create = create;
methods.update = update;
methods.summary = summary;

export default methods;
