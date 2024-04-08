import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { generate as uniqueId } from 'shortid';
const create = async (userModel, req, res) => {
    try {
        const User = mongoose.model(userModel);
        const UserPassword = mongoose.model(userModel + 'Password');
        let { email, password, enabled, name, surname, role } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                result: null,
                message: "Email or password fields they don't have been entered.",
            });
        }
        if (role === 'owner') {
            return res.status(403).send({
                success: false,
                result: null,
                message: "You can't create a user with the role 'owner'",
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                result: null,
                message: 'An account with this email already exists.',
            });
        }
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                result: null,
                message: 'The password needs to be at least 8 characters long.',
            });
        }
        const salt = uniqueId();
        const passwordHash = bcrypt.hashSync(salt + password);
        req.body.removed = false;
        const result = await new User({
            email,
            enabled,
            name,
            surname,
            role,
        }).save();
        if (!result) {
            return res.status(403).json({
                success: false,
                result: null,
                message: "Document couldn't be saved correctly",
            });
        }
        const userPasswordData = {
            password: passwordHash,
            salt: salt,
            user: result._id,
            emailVerified: true,
        };
        const resultPassword = await new UserPassword(userPasswordData).save();
        if (!resultPassword) {
            await User.deleteOne({ _id: result._id }).exec();
            return res.status(403).json({
                success: false,
                result: null,
                message: "Document couldn't be saved correctly",
            });
        }
        return res.status(200).json({
            success: true,
            result: {
                _id: result._id,
                enabled: result.enabled,
                email: result.email,
                name: result.name,
                surname: result.surname,
                photo: result.photo,
                role: result.role,
            },
            message: 'User document saved correctly',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'An error occurred while creating the user',
            error: error.message,
        });
    }
};
export default create;
//# sourceMappingURL=create.js.map