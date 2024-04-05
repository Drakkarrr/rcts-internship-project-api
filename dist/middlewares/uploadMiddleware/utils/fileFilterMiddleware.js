const fileFilterMiddleware = ({ type = 'default', mimetype }) => {
    const _fileType = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'application/msword',
        'text/plain',
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/pdf',
        'application/zip',
        'application/vnd.rar',
        'video/mp4',
        'video/x-msvideo',
        'audio/mpeg',
        'video/webm',
    ];
    if (type === 'default') {
        return true;
    }
    else {
        let _flag = _fileType.includes(mimetype);
        if (type === 'image' && !mimetype.startsWith('image/')) {
            _flag = false;
        }
        else if (type === 'pdf' && !mimetype.startsWith('application/pdf')) {
            _flag = false;
        }
        else if (type === 'video' && !mimetype.startsWith('video/')) {
            _flag = false;
        }
        else if (type === 'audio' && !mimetype.startsWith('audio/')) {
            _flag = false;
        }
        else if (type === 'text' &&
            !(mimetype.startsWith('text/') ||
                mimetype.startsWith('application/vnd.ms-excel') ||
                mimetype.startsWith('application/msword') ||
                mimetype.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document'))) {
            _flag = false;
        }
        else if (type === 'excel' &&
            !(mimetype.startsWith('application/vnd.ms-excel') ||
                mimetype.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'))) {
            _flag = false;
        }
        else if (type === 'compressed' &&
            !(mimetype.startsWith('application/zip') ||
                mimetype.startsWith('application/x-zip-compressed') ||
                mimetype.startsWith('application/vnd.rar'))) {
            _flag = false;
        }
        return _flag;
    }
};
export default fileFilterMiddleware;
