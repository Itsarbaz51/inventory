import { Router } from 'express';

import authRoute from './auth.route.js';
import roleRoute from './role.route.js';
import userRoute from './user.route.js';
import tenantRoute from './tenant.route.js';
import categoryRoute from './category.route.js';
import brandRoute from './brand.route.js';
import unitRoute from './unit.route.js';
import productRoute from './product.route.js';
import warehouseRoute from './warehouse.route.js';
import warehouseStockRoute from './warehouse-stock.route.js';
import purchaseRoute from './purchase.route.js';

const router = Router();

router.use('/auth', authRoute);
router.use('/roles', roleRoute);
router.use('/users', userRoute);
router.use('/tenants', tenantRoute);
router.use('/categorys', categoryRoute);
router.use('/brands', brandRoute);
router.use('/units', unitRoute);
router.use('/products', productRoute);
router.use('/warehouses', warehouseRoute);
router.use('/warehouse-stocks', warehouseStockRoute);
router.use('/purchases', purchaseRoute);

export default router;
