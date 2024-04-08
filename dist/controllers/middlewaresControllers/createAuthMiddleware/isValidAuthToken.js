import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
const isValidAuthToken = async (req, res, next, { userModel, jwtSecret = 'JWT_SECRET' }) => {
    try {
        const UserPassword = mongoose.model(`${userModel}Password`);
        const User = mongoose.model(userModel);
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                result: null,
                message: 'No authentication token, authorization denied.',
                jwtExpired: true,
            });
        }
        const verified = jwt.verify(token, process.env[jwtSecret]);
        if (!verified) {
            return res.status(401).json({
                success: false,
                result: null,
                message: 'Token verification failed, authorization denied.',
                jwtExpired: true,
            });
        }
        const [user, userPassword] = await Promise.all([
            User.findOne({ _id: verified.id, removed: false }),
            UserPassword.findOne({ user: verified.id, removed: false }),
        ]);
        if (!user) {
            return res.status(401).json({
                success: false,
                result: null,
                message: "User doesn't Exist, authorization denied.",
                jwtExpired: true,
            });
        }
        const { loggedSessions } = userPassword;
        if (!loggedSessions.includes(token)) {
            return res.status(401).json({
                success: false,
                result: null,
                message: 'User is already logged out, authorization denied.',
                jwtExpired: true,
            });
        }
        else {
            const reqUserName = userModel.toLowerCase();
            req[reqUserName] = user;
            next();
        }
    }
    catch (error) {
        return res.status(503).json({
            success: false,
            result: null,
            message: error.message,
            error: error,
            controller: 'isValidAuthToken',
        });
    }
};
export default isValidAuthToken;
