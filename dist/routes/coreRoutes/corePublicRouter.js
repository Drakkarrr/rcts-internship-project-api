import express from 'express';
import path from 'path';
const router = express.Router();
router.route('/:subPath/:directory/:file').get((req, res) => {
    try {
        const { subPath, directory, file } = req.params;
        const options = {
            root: path.join(__dirname, `../../public/${subPath}/${directory}`),
        };
        const fileName = file;
        return res.sendFile(fileName, options, (error) => {
            if (error) {
                return res.status(404).json({
                    success: false,
                    result: null,
                    message: 'we could not find : ' + file,
                });
            }
        });
    }
    catch (error) {
        return res.status(503).json({
            success: false,
            result: null,
            message: error.message,
            error: error,
        });
    }
});
export default router;
