import express from 'express';
import { catchErrors } from '@/handlers/errorHandlers';
import { hasPermission } from '@/middlewares/permission';
import appControllers from '@/controllers/appControllers';
import { routesList } from '@/models/utils';
const router = express.Router();
const routerApp = (entity, controller) => {
    router.route(`/${entity}/create`).post(hasPermission('create'), catchErrors(controller.create));
    router.route(`/${entity}/read/:id`).get(hasPermission('read'), catchErrors(controller.read));
    router
        .route(`/${entity}/update/:id`)
        .patch(hasPermission('update'), catchErrors(controller.update));
    router
        .route(`/${entity}/delete/:id`)
        .delete(hasPermission('delete'), catchErrors(controller.delete));
    router.route(`/${entity}/search`).get(hasPermission('read'), catchErrors(controller.search));
    router.route(`/${entity}/list`).get(hasPermission('read'), catchErrors(controller.list));
    router.route(`/${entity}/listAll`).get(hasPermission('read'), catchErrors(controller.listAll));
    router.route(`/${entity}/filter`).get(hasPermission('read'), catchErrors(controller.filter));
    router.route(`/${entity}/summary`).get(hasPermission('read'), catchErrors(controller.summary));
    if (entity === 'invoice' || entity === 'quote' || entity === 'offer' || entity === 'payment') {
        router.route(`/${entity}/mail`).post(hasPermission('update'), catchErrors(controller.mail));
    }
    if (entity === 'quote') {
        router
            .route(`/${entity}/convert/:id`)
            .get(hasPermission('update'), catchErrors(controller.convert));
    }
};
routesList.forEach(({ entity, controllerName }) => {
    const controller = appControllers[controllerName];
    routerApp(entity, controller);
});
export default router;
//# sourceMappingURL=appApi.js.map