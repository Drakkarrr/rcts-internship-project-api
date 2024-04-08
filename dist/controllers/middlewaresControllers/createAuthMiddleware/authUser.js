import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const authUser = async (req, res, { user, databasePassword, password, UserPasswordModel, }) => {
    try {
        const isMatch = await bcrypt.compare(databasePassword.salt + password, databasePassword.password);
        if (!isMatch) {
            return res.status(403).json({
                success: false,
                result: null,
                message: 'Invalid credentials.',
            });
        }
        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET, { expiresIn: req.body.remember ? '365d' : '24h' });
        await UserPasswordModel.findOneAndUpdate({ user: user._id }, { $push: { loggedSessions: token } }, { new: true }).exec();
        res
            .status(200)
            .cookie('token', token, {
            maxAge: req.body.remember ? 365 * 24 * 60 * 60 * 1000 : null,
            sameSite: 'Lax',
            httpOnly: true,
            secure: false,
            domain: req.hostname,
            path: '/',
            Partitioned: true,
        })
            .json({
            success: true,
            result: {
                _id: user._id,
                name: user.name,
                surname: user.surname,
                role: user.role,
                email: user.email,
                photo: user.photo,
            },
            message: 'Successfully login user',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
export default authUser;
//# sourceMappingURL=authUser.js.map