import multer from 'multer';
import path from 'path';
import { slugify } from 'transliteration';
import fileFilter from './utils/LocalfileFilter';
const singleStorageUpload = ({ entity, fileType = 'default', uploadFieldName = 'file', fieldName = 'file', }) => {
    const diskStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `src/public/uploads/${entity}`);
        },
        filename: function (req, file, cb) {
            try {
                const fileExtension = path.extname(file.originalname);
                const uniqueFileID = Math.random().toString(36).slice(2, 7);
                let originalname = '';
                if (req.body.seotitle) {
                    originalname = slugify(req.body.seotitle.toLocaleLowerCase());
                }
                else {
                    originalname = slugify(file.originalname.split('.')[0].toLocaleLowerCase());
                }
                const _fileName = `${originalname}-${uniqueFileID}${fileExtension}`;
                const filePath = `public/uploads/${entity}/${_fileName}`;
                req.upload = {
                    fileName: _fileName,
                    fieldExt: fileExtension,
                    entity: entity,
                    fieldName: fieldName,
                    fileType: fileType,
                    filePath: filePath,
                };
                req.body[fieldName] = filePath;
                cb(null, _fileName);
            }
            catch (error) {
                cb(error);
            }
        },
    });
    const filterType = fileFilter(fileType);
    const multerStorage = multer({ storage: diskStorage, fileFilter: filterType }).single('file');
    return multerStorage;
};
export default singleStorageUpload;
