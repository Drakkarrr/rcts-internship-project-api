import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  success: boolean;
  message: string;
  controller?: string;
  error?: Error;
}

export const catchErrors = (fn: Function) => {
  return function (req: Request, res: Response, next: NextFunction) {
    return fn(req, res, next).catch((error: Error) => {
      if (error.name == 'ValidationError') {
        return res.status(400).json({
          success: false,
          result: null,
          message: 'Required fields are not supplied',
          controller: fn.name,
          error: error,
        } as ErrorResponse);
      } else {
        return res.status(500).json({
          success: false,
          result: null,
          message: error.message,
          controller: fn.name,
          error: error,
        } as ErrorResponse);
      }
    });
  };
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    success: false,
    message: "Api url doesn't exist ",
  } as ErrorResponse);
};

export const developmentErrors = (
  error: Error | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.stack = error.stack || '';
  const errorDetails = {
    message: error.message,
    status: error.status,
    stackHighlighted: error.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>'),
  };

  return res.status(500).json({
    success: false,
    message: error.message,
    error: error,
  } as ErrorResponse);
};

export const productionErrors = (error: Error, req: Request, res: Response, next: NextFunction) => {
  return res.status(500).json({
    success: false,
    message: error.message,
    error: error,
  } as ErrorResponse);
};
