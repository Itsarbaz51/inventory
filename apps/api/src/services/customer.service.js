import { ApiError } from '../utils/ApiError.js';
import Prisma from '../database/db.js';

class CustomerServices {
  // CREATE
  static async create(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const {
      name,
      phone,
      email,
      gstNumber,
      panNumber,
      billingAddress,
      shippingAddress,
      city,
      state,
      pincode,
      openingBalance = 0,
      creditLimit,
      paymentTerms,
      isWalkIn = false,
      isActive = true,
    } = payload;

    if (!name?.trim()) {
      throw new ApiError(400, 'Customer name is required');
    }

    // Check duplicate email inside tenant
    if (email) {
      const existingEmail = await Prisma.customer.findFirst({
        where: {
          tenantId,
          email: email.trim(),
        },
      });

      if (existingEmail) {
        throw new ApiError(
          409,
          `Customer with email "${email}" already exists`
        );
      }
    }

    // Check duplicate phone inside tenant
    if (phone) {
      const existingPhone = await Prisma.customer.findFirst({
        where: {
          tenantId,
          phone: phone.trim(),
        },
      });

      if (existingPhone) {
        throw new ApiError(
          409,
          `Customer with phone "${phone}" already exists`
        );
      }
    }

    const customer = await Prisma.customer.create({
      data: {
        tenantId,
        name: name.trim(),
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        gstNumber: gstNumber?.trim() || null,
        panNumber: panNumber?.trim() || null,
        billingAddress: billingAddress?.trim() || null,
        shippingAddress: shippingAddress?.trim() || null,
        city: city?.trim() || null,
        state: state?.trim() || null,
        pincode: pincode?.trim() || null,
        openingBalance,
        creditLimit: creditLimit ?? null,
        paymentTerms: paymentTerms ?? null,
        isWalkIn,
        isActive,
      },
    });

    return customer;
  }

  // UPDATE
  static async update(params, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = params;

    if (!id) {
      throw new ApiError(400, 'Customer id is required');
    }

    const customer = await Prisma.customer.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!customer) {
      throw new ApiError(404, 'Customer not found');
    }

    const {
      name,
      phone,
      email,
      gstNumber,
      panNumber,
      billingAddress,
      shippingAddress,
      city,
      state,
      pincode,
      openingBalance,
      creditLimit,
      paymentTerms,
      isWalkIn,
      isActive,
    } = req.body;

    // Duplicate email check
    if (email !== undefined && email !== null) {
      const duplicateEmail = await Prisma.customer.findFirst({
        where: {
          tenantId,
          email: email.trim(),
          NOT: {
            id,
          },
        },
      });

      if (duplicateEmail) {
        throw new ApiError(
          409,
          `Customer with email "${email}" already exists`
        );
      }
    }

    // Duplicate phone check
    if (phone !== undefined && phone !== null) {
      const duplicatePhone = await Prisma.customer.findFirst({
        where: {
          tenantId,
          phone: phone.trim(),
          NOT: {
            id,
          },
        },
      });

      if (duplicatePhone) {
        throw new ApiError(
          409,
          `Customer with phone "${phone}" already exists`
        );
      }
    }

    const updatedCustomer = await Prisma.customer.update({
      where: {
        id,
      },

      data: {
        ...(name !== undefined && {
          name: name.trim(),
        }),

        ...(phone !== undefined && {
          phone: phone?.trim() || null,
        }),

        ...(email !== undefined && {
          email: email?.trim() || null,
        }),

        ...(gstNumber !== undefined && {
          gstNumber: gstNumber?.trim() || null,
        }),

        ...(panNumber !== undefined && {
          panNumber: panNumber?.trim() || null,
        }),

        ...(billingAddress !== undefined && {
          billingAddress: billingAddress?.trim() || null,
        }),

        ...(shippingAddress !== undefined && {
          shippingAddress: shippingAddress?.trim() || null,
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

        ...(isWalkIn !== undefined && {
          isWalkIn,
        }),

        ...(isActive !== undefined && {
          isActive,
        }),
      },
    });

    return updatedCustomer;
  }

  // GET BY ID
  static async getById(params, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = params;

    if (!id) {
      throw new ApiError(400, 'Customer id is required');
    }

    const customer = await Prisma.customer.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        _count: {
          select: {
            sales: true,
            salesReturns: true,
            payments: true,
          },
        },
      },
    });

    if (!customer) {
      throw new ApiError(404, 'Customer not found');
    }

    return customer;
  }

  // GET ALL
  static async getAll(req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const customers = await Prisma.customer.findMany({
      where: {
        tenantId,
      },

      include: {
        _count: {
          select: {
            sales: true,
            salesReturns: true,
            payments: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return customers;
  }

  // DELETE
  static async delete(params, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = params;

    if (!id) {
      throw new ApiError(400, 'Customer id is required');
    }

    const customer = await Prisma.customer.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        _count: {
          select: {
            sales: true,
            salesReturns: true,
            payments: true,
          },
        },
      },
    });

    if (!customer) {
      throw new ApiError(404, 'Customer not found');
    }

    // Don't delete customer having transactions
    if (
      customer._count.sales > 0 ||
      customer._count.salesReturns > 0 ||
      customer._count.payments > 0
    ) {
      throw new ApiError(
        400,
        'Cannot delete customer because transactions are associated with this customer'
      );
    }

    await Prisma.customer.delete({
      where: {
        id,
      },
    });

    return null;
  }
}

export default CustomerServices;