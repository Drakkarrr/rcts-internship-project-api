import { catchErrors } from '../../handlers/errorHandlers';
import express from 'express';
// import adminAuth from '@/controllers/coreControllers/adminAuth';
import adminAuth from '../../controllers/coreControllers/adminAuth';

const router = express.Router();

router.route('/login').post(catchErrors(adminAuth.login));

router.route('/forgetpassword').post(catchErrors(adminAuth.forgetPassword));
router.route('/resetpassword').post(catchErrors(adminAuth.resetPassword));

router.route('/logout').post(adminAuth.isValidAuthToken, catchErrors(adminAuth.logout));

export default router;
