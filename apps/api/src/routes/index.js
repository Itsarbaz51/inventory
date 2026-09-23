import { Router } from 'express';
import authRoute from './auth.route.js';
import roleRoute from './role.route.js';
import userRoute from './user.route.js';

const router = Router();

router.use('/auth', authRoute);
router.use('/role', roleRoute);
router.use('/users', userRoute);

export default router;
