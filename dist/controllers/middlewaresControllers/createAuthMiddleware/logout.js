import mongoose from 'mongoose';
const logout = async (req, res, { userModel }) => {
    const UserPassword = mongoose.model(userModel + 'Password');
    const token = req.cookies.token;
    await UserPassword.findOneAndUpdate({ user: req.admin._id }, { $pull: { loggedSessions: token } }, {
        new: true,
    }).exec();
    res
        .clearCookie('token', {
        maxAge: null,
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        domain: req.hostname,
        path: '/',
    })
        .json({
        success: true,
        result: {},
        message: 'Successfully logout',
    });
};
export default logout;
//# sourceMappingURL=logout.js.map