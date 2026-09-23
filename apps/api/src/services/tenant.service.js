import Prisma from '../database/db.js';
import { ApiError } from '../utils/ApiError.js';

class TenantServices {
  // =====================================================
  // CREATE TENANT
  // =====================================================
  static async create(payload) {
    const {
      name,
      businessName,
      email,
      phone,
      gstNumber,
      panNumber,
      businessType,
      logo,
      address,
      city,
      state,
      pincode,
      country = 'India',

      invoicePrefix = 'INV',
      purchasePrefix = 'PUR',
      salesReturnPrefix = 'SR',
      purchaseReturnPrefix = 'PR',

      invoiceStartNumber = 1,
      purchaseStartNumber = 1,
      salesReturnStartNumber = 1,
      purchaseReturnStartNumber = 1,

      lowStockThreshold = 10,
      status = 'ACTIVE',
    } = payload;

    // ---------------------------------------------------
    // Generate Tenant Number
    // ---------------------------------------------------

    const lastTenant = await Prisma.tenant.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        tenantNumber: true,
      },
    });

    let nextNumber = 1;

    if (lastTenant?.tenantNumber) {
      const match = lastTenant.tenantNumber.match(/(\d+)$/);

      if (match) {
        nextNumber = Number(match[1]) + 1;
      }
    }

    const tenantNumber = `TEN${String(nextNumber).padStart(6, '0')}`;

    // ---------------------------------------------------
    // Duplicate Email
    // ---------------------------------------------------

    if (email) {
      const existingTenant = await Prisma.tenant.findFirst({
        where: {
          email: email.toLowerCase(),
        },
      });

      if (existingTenant) {
        throw new ApiError(409, 'Tenant with this email already exists');
      }
    }

    // ---------------------------------------------------
    // Duplicate GST
    // ---------------------------------------------------

    if (gstNumber) {
      const existingTenant = await Prisma.tenant.findFirst({
        where: {
          gstNumber,
        },
      });

      if (existingTenant) {
        throw new ApiError(409, 'Tenant with this GST number already exists');
      }
    }

    // ---------------------------------------------------
    // Duplicate PAN
    // ---------------------------------------------------

    if (panNumber) {
      const existingTenant = await Prisma.tenant.findFirst({
        where: {
          panNumber,
        },
      });

      if (existingTenant) {
        throw new ApiError(409, 'Tenant with this PAN number already exists');
      }
    }

    // ---------------------------------------------------
    // Create
    // ---------------------------------------------------

    const tenant = await Prisma.tenant.create({
      data: {
        tenantNumber,

        name: name.trim(),

        businessName: businessName?.trim() || null,

        email: email?.toLowerCase().trim() || null,

        phone: phone?.trim() || null,

        gstNumber: gstNumber?.trim() || null,

        panNumber: panNumber?.trim() || null,

        businessType: businessType?.trim() || null,

        logo: logo?.trim() || null,

        address: address?.trim() || null,

        city: city?.trim() || null,

        state: state?.trim() || null,

        pincode: pincode?.trim() || null,

        country: country.trim(),

        invoicePrefix: invoicePrefix.trim(),

        purchasePrefix: purchasePrefix.trim(),

        salesReturnPrefix: salesReturnPrefix.trim(),

        purchaseReturnPrefix: purchaseReturnPrefix.trim(),

        invoiceStartNumber,

        purchaseStartNumber,

        salesReturnStartNumber,

        purchaseReturnStartNumber,

        lowStockThreshold,

        status,
      },
    });

    return tenant;
  }

  // =====================================================
  // UPDATE TENANT
  // =====================================================
  static async update(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const {
      name,
      businessName,
      email,
      phone,
      gstNumber,
      panNumber,
      businessType,
      logo,
      address,
      city,
      state,
      pincode,
      country,

      invoicePrefix,
      purchasePrefix,
      salesReturnPrefix,
      purchaseReturnPrefix,

      invoiceStartNumber,
      purchaseStartNumber,
      salesReturnStartNumber,
      purchaseReturnStartNumber,

      lowStockThreshold,
      status,
    } = req.body;

    // ---------------------------------------------------
    // Find Tenant
    // ---------------------------------------------------

    const tenant = await Prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
    });

    if (!tenant) {
      throw new ApiError(404, 'Tenant not found');
    }

    // ---------------------------------------------------
    // Email Duplicate
    // ---------------------------------------------------

    if (email !== undefined && email !== null) {
      const existingTenant = await Prisma.tenant.findFirst({
        where: {
          email: email.toLowerCase(),

          NOT: {
            id: tenantId,
          },
        },
      });

      if (existingTenant) {
        throw new ApiError(409, 'Tenant with this email already exists');
      }
    }

    // ---------------------------------------------------
    // GST Duplicate
    // ---------------------------------------------------

    if (gstNumber !== undefined && gstNumber !== null) {
      const existingTenant = await Prisma.tenant.findFirst({
        where: {
          gstNumber,

          NOT: {
            id: tenantId,
          },
        },
      });

      if (existingTenant) {
        throw new ApiError(409, 'Tenant with this GST number already exists');
      }
    }

    // ---------------------------------------------------
    // PAN Duplicate
    // ---------------------------------------------------

    if (panNumber !== undefined && panNumber !== null) {
      const existingTenant = await Prisma.tenant.findFirst({
        where: {
          panNumber,

          NOT: {
            id: tenantId,
          },
        },
      });

      if (existingTenant) {
        throw new ApiError(409, 'Tenant with this PAN number already exists');
      }
    }

    // ---------------------------------------------------
    // Update Data
    // ---------------------------------------------------

    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();

    if (businessName !== undefined)
      updateData.businessName = businessName?.trim() || null;

    if (email !== undefined)
      updateData.email = email?.toLowerCase().trim() || null;

    if (phone !== undefined) updateData.phone = phone?.trim() || null;

    if (gstNumber !== undefined)
      updateData.gstNumber = gstNumber?.trim() || null;

    if (panNumber !== undefined)
      updateData.panNumber = panNumber?.trim() || null;

    if (businessType !== undefined)
      updateData.businessType = businessType?.trim() || null;

    if (logo !== undefined) updateData.logo = logo?.trim() || null;

    if (address !== undefined) updateData.address = address?.trim() || null;

    if (city !== undefined) updateData.city = city?.trim() || null;

    if (state !== undefined) updateData.state = state?.trim() || null;

    if (pincode !== undefined) updateData.pincode = pincode?.trim() || null;

    if (country !== undefined) updateData.country = country.trim();

    if (invoicePrefix !== undefined)
      updateData.invoicePrefix = invoicePrefix.trim();

    if (purchasePrefix !== undefined)
      updateData.purchasePrefix = purchasePrefix.trim();

    if (salesReturnPrefix !== undefined)
      updateData.salesReturnPrefix = salesReturnPrefix.trim();

    if (purchaseReturnPrefix !== undefined)
      updateData.purchaseReturnPrefix = purchaseReturnPrefix.trim();

    if (invoiceStartNumber !== undefined)
      updateData.invoiceStartNumber = invoiceStartNumber;

    if (purchaseStartNumber !== undefined)
      updateData.purchaseStartNumber = purchaseStartNumber;

    if (salesReturnStartNumber !== undefined)
      updateData.salesReturnStartNumber = salesReturnStartNumber;

    if (purchaseReturnStartNumber !== undefined)
      updateData.purchaseReturnStartNumber = purchaseReturnStartNumber;

    if (lowStockThreshold !== undefined)
      updateData.lowStockThreshold = lowStockThreshold;

    if (status !== undefined) updateData.status = status;

    // ---------------------------------------------------
    // Update
    // ---------------------------------------------------

    const updatedTenant = await Prisma.tenant.update({
      where: {
        id: tenantId,
      },

      data: updateData,
    });

    return updatedTenant;
  }

  // =====================================================
  // GET BY ID
  // =====================================================
  static async getById(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = payload;

    if (!id) {
      throw new ApiError(400, 'Tenant id is required');
    }

    // Security:
    // User can only access own tenant

    if (id !== tenantId) {
      throw new ApiError(403, 'You cannot access this tenant');
    }

    const tenant = await Prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },

      include: {
        _count: {
          select: {
            users: true,
            roles: true,
            categories: true,
            brands: true,
            products: true,
            warehouses: true,
            suppliers: true,
            customers: true,
            purchases: true,
            sales: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new ApiError(404, 'Tenant not found');
    }

    return tenant;
  }

  // =====================================================
  // GET ALL TENANTS
  // =====================================================
  static async getAll(payload) {
    const { page = 1, limit = 10, search, status } = payload;

    const skip = (page - 1) * limit;

    const where = {};

    // ---------------------------------------------------
    // Search
    // ---------------------------------------------------

    if (search) {
      where.OR = [
        {
          tenantNumber: {
            contains: search,
          },
        },

        {
          name: {
            contains: search,
          },
        },

        {
          businessName: {
            contains: search,
          },
        },

        {
          email: {
            contains: search,
          },
        },

        {
          phone: {
            contains: search,
          },
        },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [tenants, total] = await Prisma.$transaction([
      Prisma.tenant.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        include: {
          _count: {
            select: {
              users: true,
              products: true,
              warehouses: true,
              suppliers: true,
              customers: true,
            },
          },
        },
      }),

      Prisma.tenant.count({
        where,
      }),
    ]);

    return {
      tenants,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // =====================================================
  // DELETE TENANT
  // =====================================================
  static async delete(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = payload;

    if (!id) {
      throw new ApiError(400, 'Tenant id is required');
    }

    if (id !== tenantId) {
      throw new ApiError(403, 'You cannot delete this tenant');
    }

    const tenant = await Prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },

      include: {
        _count: {
          select: {
            users: true,
            products: true,
            purchases: true,
            sales: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new ApiError(404, 'Tenant not found');
    }

    // ---------------------------------------------------
    // Don't delete tenant having data
    // ---------------------------------------------------

    const hasData =
      tenant._count.users > 0 ||
      tenant._count.products > 0 ||
      tenant._count.purchases > 0 ||
      tenant._count.sales > 0;

    if (hasData) {
      throw new ApiError(
        400,
        'Cannot delete tenant because data is associated with this tenant',
      );
    }

    await Prisma.tenant.delete({
      where: {
        id: tenantId,
      },
    });

    return null;
  }
}

export default TenantServices;
