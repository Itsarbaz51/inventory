import { Router } from 'express';
import authRoute from './auth.route.js';
import roleRoute from './role.route.js';

const router = Router();

router.use('/auth', authRoute);
router.use('/role', roleRoute);

export default router;
