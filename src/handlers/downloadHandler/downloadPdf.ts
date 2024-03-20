import { Request, Response } from 'express';
import custom from '@/controllers/pdfController';
import mongoose from 'mongoose';

interface DownloadPdfParams {
  directory: string;
  id: string;
}

const downloadPdf = async (req: Request, res: Response, { directory, id }: DownloadPdfParams) => {
  try {
    const modelName = directory.slice(0, 1).toUpperCase() + directory.slice(1);
    if (mongoose.models[modelName]) {
      const Model = mongoose.model<any>(modelName);
      const result = await Model.findOne({
        _id: id,
      }).exec();

      if (!result) {
        throw { name: 'ValidationError' };
      }

      const fileId = modelName.toLowerCase() + '-' + result._id + '.pdf';
      const folderPath = modelName.toLowerCase();
      const targetLocation = `src/public/download/${folderPath}/${fileId}`;
      await custom.generatePdf(
        modelName,
        { filename: folderPath, format: 'A4', targetLocation },
        result,
        async () => {
          return res.download(targetLocation, (error) => {
            if (error)
              return res.status(500).json({
                success: false,
                result: null,
                message: "Couldn't find file",
                error: error.message,
              });
          });
        }
      );
    } else {
      return res.status(404).json({
        success: false,
        result: null,
        message: `Model '${modelName}' does not exist`,
      });
    }
  } catch (error: any) {
    if (error.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        error: error.message,
        message: 'Required fields are not supplied',
      });
    } else if (error.name == 'BSONTypeError') {
      return res.status(400).json({
        success: false,
        result: null,
        error: error.message,
        message: 'Invalid ID',
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        error: error.message,
        message: error.message,
        controller: 'downloadPDF.js',
      });
    }
  }
};

export default downloadPdf;
