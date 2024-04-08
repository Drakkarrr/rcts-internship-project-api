export const catchErrors = (fn) => {
    return function (req, res, next) {
        return fn(req, res, next).catch((error) => {
            if (error.name == 'ValidationError') {
                return res.status(400).json({
                    success: false,
                    result: null,
                    message: 'Required fields are not supplied',
                    controller: fn.name,
                    error: error,
                });
            }
            else {
                return res.status(500).json({
                    success: false,
                    result: null,
                    message: error.message,
                    controller: fn.name,
                    error: error,
                });
            }
        });
    };
};
export const notFound = (req, res, next) => {
    return res.status(404).json({
        success: false,
        message: "Api url doesn't exist ",
    });
};
export const developmentErrors = (error, req, res, next) => {
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
    });
};
export const productionErrors = (error, req, res, next) => {
    return res.status(500).json({
        success: false,
        message: error.message,
        error: error,
    });
};
export default {
    catchErrors,
    notFound,
    developmentErrors,
    productionErrors,
};
//# sourceMappingURL=errorHandlers.js.map