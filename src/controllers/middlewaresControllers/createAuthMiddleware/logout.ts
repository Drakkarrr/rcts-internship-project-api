import { Request, Response } from 'express';
import mongoose from 'mongoose';

interface LogoutOptions {
  userModel: string;
}

const logout = async (req: Request | any, res: Response, { userModel }: LogoutOptions) => {
  const UserPassword = mongoose.model(userModel + 'Password');

  const token = req.cookies.token;
  await UserPassword.findOneAndUpdate(
    { user: req.admin._id },
    { $pull: { loggedSessions: token } },
    {
      new: true,
    }
  ).exec();

  res
    .clearCookie('token', {
      maxAge: null as any,
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
