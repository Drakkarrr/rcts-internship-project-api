import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import coreAuthRouter from './routes/coreRoutes/coreAuth';
import coreApiRouter from './routes/coreRoutes/coreApi';
import coreDownloadRouter from './routes/coreRoutes/coreDownloadRouter';
import corePublicRouter from './routes/coreRoutes/corePublicRouter';
import adminAuth from './controllers/coreControllers/adminAuth';
import errorHandlers from './handlers/errorHandlers';
import erpApiRouter from './routes/appRoutes/appApi';

const app: Express = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());

app.use('/api', coreAuthRouter);
app.use('/api', adminAuth.isValidAuthToken, coreApiRouter);
app.use('/api', adminAuth.isValidAuthToken, erpApiRouter);
app.use('/download', coreDownloadRouter);
app.use('/public', corePublicRouter);

app.use(errorHandlers.notFound);
app.use(errorHandlers.productionErrors);

export default app;
