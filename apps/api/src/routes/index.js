import { Router } from 'express';

import authRoute from './auth.route.js';
import roleRoute from './role.route.js';
import userRoute from './user.route.js';
import tenantRoute from './tenant.route.js';

const router = Router();

router.use('/auth', authRoute);
router.use('/roles', roleRoute);
router.use('/users', userRoute);
router.use('/tenants', tenantRoute);

export default router;
