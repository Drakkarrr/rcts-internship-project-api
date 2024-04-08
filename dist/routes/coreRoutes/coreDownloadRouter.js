import express from 'express';
import downloadPdf from '@/handlers/downloadHandler/downloadPdf';
const router = express.Router();
router.route('/:directory/:file').get((req, res) => {
    try {
        const { directory, file } = req.params;
        const id = file.slice(directory.length + 1).slice(0, -4);
        downloadPdf(req, res, { directory, id });
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
