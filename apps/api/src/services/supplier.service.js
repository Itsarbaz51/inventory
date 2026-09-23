import { ApiError } from '../utils/ApiError.js';
import Prisma from '../database/db.js';

class SupplierServices {
  // =====================================================
  // CREATE
  // =====================================================
  static async create(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const {
      name,
      companyName,
      phone,
      email,
      gstNumber,
      panNumber,
      address,
      city,
      state,
      pincode,
      openingBalance = 0,
      creditLimit,
      paymentTerms,
      isActive = true,
    } = payload;

    // ---------------------------------------------------
    // Duplicate supplier check
    // ---------------------------------------------------

    const existingSupplier = await Prisma.supplier.findFirst({
      where: {
        tenantId,
        name: name.trim(),
        ...(phone && {
          phone: phone.trim(),
        }),
      },
    });

    if (existingSupplier) {
      throw new ApiError(409, 'Supplier already exists');
    }

    // ---------------------------------------------------
    // Create supplier
    // ---------------------------------------------------

    const supplier = await Prisma.supplier.create({
      data: {
        tenantId,

        name: name.trim(),

        companyName: companyName?.trim() || null,

        phone: phone?.trim() || null,

        email: email?.trim().toLowerCase() || null,

        gstNumber: gstNumber?.trim().toUpperCase() || null,

        panNumber: panNumber?.trim().toUpperCase() || null,

        address: address?.trim() || null,

        city: city?.trim() || null,

        state: state?.trim() || null,

        pincode: pincode?.trim() || null,

        openingBalance,

        creditLimit: creditLimit ?? null,

        paymentTerms: paymentTerms ?? null,

        isActive,
      },
    });

    return supplier;
  }

  // =====================================================
  // GET ALL
  // =====================================================
  static async getAll(req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { search, isActive } = req.query;

    const suppliers = await Prisma.supplier.findMany({
      where: {
        tenantId,

        ...(isActive !== undefined && {
          isActive: isActive === 'true',
        }),

        ...(search && {
          OR: [
            {
              name: {
                contains: search,
              },
            },
            {
              companyName: {
                contains: search,
              },
            },
            {
              phone: {
                contains: search,
              },
            },
            {
              email: {
                contains: search,
              },
            },
            {
              gstNumber: {
                contains: search,
              },
            },
          ],
        }),
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return suppliers;
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

    const supplier = await Prisma.supplier.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        _count: {
          select: {
            purchases: true,
            payments: true,
            purchaseReturns: true,
          },
        },
      },
    });

    if (!supplier) {
      throw new ApiError(404, 'Supplier not found');
    }

    return supplier;
  }

  // =====================================================
  // UPDATE
  // =====================================================
  static async update(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = payload;

    const supplier = await Prisma.supplier.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!supplier) {
      throw new ApiError(404, 'Supplier not found');
    }

    const {
      name,
      companyName,
      phone,
      email,
      gstNumber,
      panNumber,
      address,
      city,
      state,
      pincode,
      openingBalance,
      creditLimit,
      paymentTerms,
      isActive,
    } = req.body;

    // ---------------------------------------------------
    // Duplicate check
    // ---------------------------------------------------

    if (name !== undefined || phone !== undefined) {
      const duplicateSupplier = await Prisma.supplier.findFirst({
        where: {
          tenantId,

          ...(name !== undefined && {
            name: name.trim(),
          }),

          ...(phone !== undefined &&
            phone && {
              phone: phone.trim(),
            }),

          NOT: {
            id,
          },
        },
      });

      if (duplicateSupplier) {
        throw new ApiError(409, 'Supplier with same details already exists');
      }
    }

    // ---------------------------------------------------
    // Update
    // ---------------------------------------------------

    const updatedSupplier = await Prisma.supplier.update({
      where: {
        id,
      },

      data: {
        ...(name !== undefined && {
          name: name.trim(),
        }),

        ...(companyName !== undefined && {
          companyName: companyName?.trim() || null,
        }),

        ...(phone !== undefined && {
          phone: phone?.trim() || null,
        }),

        ...(email !== undefined && {
          email: email?.trim().toLowerCase() || null,
        }),

        ...(gstNumber !== undefined && {
          gstNumber: gstNumber?.trim().toUpperCase() || null,
        }),

        ...(panNumber !== undefined && {
          panNumber: panNumber?.trim().toUpperCase() || null,
        }),

        ...(address !== undefined && {
          address: address?.trim() || null,
        }),

        ...(city !== undefined && {
          city: city?.trim() || null,
        }),

        ...(state !== undefined && {
          state: state?.trim() || null,
        }),

        ...(pincode !== undefined && {
          pincode: pincode?.trim() || null,
        }),

        ...(openingBalance !== undefined && {
          openingBalance,
        }),

        ...(creditLimit !== undefined && {
          creditLimit,
        }),

        ...(paymentTerms !== undefined && {
          paymentTerms,
        }),

        ...(isActive !== undefined && {
          isActive,
        }),
      },
    });

    return updatedSupplier;
  }

  // =====================================================
  // DELETE
  // =====================================================
  static async delete(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = payload;

    const supplier = await Prisma.supplier.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        _count: {
          select: {
            purchases: true,
            payments: true,
            purchaseReturns: true,
          },
        },
      },
    });

    if (!supplier) {
      throw new ApiError(404, 'Supplier not found');
    }

    // ---------------------------------------------------
    // Don't delete supplier with transactions
    // ---------------------------------------------------

    if (
      supplier._count.purchases > 0 ||
      supplier._count.payments > 0 ||
      supplier._count.purchaseReturns > 0
    ) {
      throw new ApiError(
        400,
        'Cannot delete supplier because transactions are associated with this supplier',
      );
    }

    await Prisma.supplier.delete({
      where: {
        id,
      },
    });

    return null;
  }
}

export default SupplierServices;
