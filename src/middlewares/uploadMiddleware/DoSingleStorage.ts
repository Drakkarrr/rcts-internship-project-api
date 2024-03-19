import { Request, Response, NextFunction } from 'express';
import { extname, parse } from 'path';
import { slugify } from 'transliteration';
import fileFilterMiddleware from './utils/fileFilterMiddleware';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const secretAccessKey: string = process.env.DO_SPACES_SECRET || '';
const accessKeyId: string = process.env.DO_SPACES_KEY || '';
const endpoint: string = 'https://' + (process.env.DO_SPACES_URL || '');
const region: string = process.env.REGION || '';

const clientParams = {
  endpoint: endpoint,
  region: region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
};

const DoSingleStorage = ({
  entity,
  fileType = 'default',
  uploadFieldName = 'file',
  fieldName = 'file',
}: {
  entity: string;
  fileType?: string;
  uploadFieldName?: string;
  fieldName?: string;
}) => {
  return async function (req: Request | any, res: Response, next: NextFunction) {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
      req.body[fieldName] = null;
      next();
    } else {
      const s3Client = new S3Client(clientParams);

      try {
        if (!fileFilterMiddleware({ type: fileType as any, mimetype: req.files.file.mimetype })) {
          throw new Error('Uploaded file type not supported');
        }
        let fileExtension = extname(req.files.file.name);
        const { name: fileNameWithoutExt } = parse(req.files.file.name);

        let uniqueFileID = Math.random().toString(36).slice(2, 7);

        let originalname = '';
        if (req.body.seotitle) {
          originalname = slugify(req.body.seotitle.toLocaleLowerCase());
        } else {
          originalname = slugify(fileNameWithoutExt.toLocaleLowerCase());
        }

        let _fileName = `${originalname}-${uniqueFileID}${fileExtension}`;

        const filePath = `public/uploads/${entity}/${_fileName}`;

        let uploadParams = {
          Key: `${filePath}`,
          Bucket: process.env.DO_SPACES_NAME || '',
          ACL: 'public-read',
          Body: req.files.file.data,
        };
        const command = new PutObjectCommand(uploadParams as any);
        const s3response = await s3Client.send(command);

        if (s3response.$metadata.httpStatusCode === 200) {
          req.upload = {
            fileName: _fileName,
            fieldExt: fileExtension,
            entity: entity,
            fieldName: fieldName,
            fileType: fileType,
            filePath: filePath,
          };

          req.body[fieldName] = filePath;
          next();
        }
      } catch (error) {
        return res.status(403).json({
          success: false,
          result: null,
          controller: 'DoSingleStorage.js',
          message: 'Error on uploading file',
        });
      }
    }
  };
};

export default DoSingleStorage;
