import CryptoService from '../src/utils/crypto.utils.js';
import Prisma from '../src/database/db.js';
import HelperUtils from '../src/utils/helper.utils.js';

async function main() {
  console.log('🚀 Starting seed...\n');

  // ============================================
  // TENANT
  // ============================================

  const tenantEmail = 'admin@arbaz.com';

  let tenant = await Prisma.tenant.findFirst({
    where: {
      email: tenantEmail,
    },
  });

  if (tenant) {
    console.log('⏭️ Tenant already exists:', tenant.name);
  } else {
    tenant = await Prisma.tenant.create({
      data: {
        name: 'arbaz',
        tenantNumber: HelperUtils.generateUniqueId('TNT'),
        businessName: 'arbaz',
        email: tenantEmail,
        phone: '9999999999',

        businessType: 'PRIVATE_LIMITED',

        country: 'India',

        invoicePrefix: 'INV',
        purchasePrefix: 'PUR',
        salesReturnPrefix: 'SR',
        purchaseReturnPrefix: 'PR',

        invoiceStartNumber: 1,
        purchaseStartNumber: 1,
        salesReturnStartNumber: 1,
        purchaseReturnStartNumber: 1,

        lowStockThreshold: 10,

        status: 'ACTIVE',
      },
    });

    console.log('✅ Tenant created:', tenant.name);
  }

  // ============================================
  // SUPER ADMIN ROLE
  // ============================================

  let superAdminRole = await Prisma.role.findFirst({
    where: {
      tenantId: tenant.id,
      name: 'SUPER_ADMIN',
    },
  });

  if (superAdminRole) {
    console.log('⏭️ SUPER_ADMIN role already exists');
  } else {
    superAdminRole = await Prisma.role.create({
      data: {
        tenantId: tenant.id,

        name: 'SUPER_ADMIN',

        description: 'Full access to the tenant',

        isSystem: true,
      },
    });

    console.log('✅ SUPER_ADMIN role created');
  }

  // ============================================
  // SUPER ADMIN USER
  // ============================================

  const adminEmail = 'admin@gmail.com';

  const existingAdmin = await Prisma.user.findFirst({
    where: {
      tenantId: tenant.id,
      email: adminEmail,
    },
  });

  if (existingAdmin) {
    console.log('⏭️ Super Admin already exists:', existingAdmin.email);
  } else {
    const adminPassword = CryptoService.encrypt('Admin@123');

    const admin = await Prisma.user.create({
      data: {
        tenantId: tenant.id,
        userNumber: HelperUtils.generateUniqueId('USR'),

        name: 'Super Admin',
        email: adminEmail,
        phone: '9999999999',

        password: adminPassword,

        roleId: superAdminRole.id,

        status: 'ACTIVE',
      },
    });

    console.log('✅ Super Admin created:', admin.email);
  }

  console.log('\n🎉 Seeding completed successfully!');
}

main()
  .then(async () => {
    await Prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('❌ Seeding failed:', err);

    await Prisma.$disconnect();
    process.exit(1);
  });
