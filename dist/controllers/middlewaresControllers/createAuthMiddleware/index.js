import isValidAuthToken from './isValidAuthToken';
import login from './login';
import logout from './logout';
import forgetPassword from './forgetPassword';
import resetPassword from './resetPassword';
const createAuthMiddleware = (userModel) => {
    let authMethods = {};
    authMethods.isValidAuthToken = (req, res, next) => isValidAuthToken(req, res, next, {
        userModel,
    });
    authMethods.login = (req, res) => login(req, res, {
        userModel,
    });
    authMethods.forgetPassword = (req, res) => forgetPassword(req, res, {
        userModel,
    });
    authMethods.resetPassword = (req, res) => resetPassword(req, res, {
        userModel,
    });
    authMethods.logout = (req, res) => logout(req, res, {
        userModel,
    });
    return authMethods;
};
export default createAuthMiddleware;
//# sourceMappingURL=index.js.map