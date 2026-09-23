import jwt from 'jsonwebtoken';
import Prisma from '../database/db.js';
import { ApiError } from '../utils/ApiError.js';
import { envConfig } from '../config/index.js';

class AuthMiddleware {
  static isAuthenticated = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      const token = authHeader?.startsWith('Bearer ')
        ? authHeader.substring(7)
        : req.cookies?.accessToken;

      if (!token) {
        throw ApiError.unauthorized('No token provided');
      }

      let decoded;

      try {
        decoded = jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET);
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          throw ApiError.unauthorized('Access token expired');
        }

        throw ApiError.unauthorized('Invalid access token');
      }

      if (!decoded?.id) {
        throw ApiError.unauthorized('Invalid token payload');
      }

      const user = await Prisma.user.findUnique({
        where: {
          id: decoded.id,
        },

        select: {
          id: true,

          tenantId: true,

          name: true,
          email: true,
          phone: true,

          status: true,

          roleId: true,

          role: {
            select: {
              id: true,
              name: true,
              description: true,
              isSystem: true,
            },
          },
        },
      });

      if (!user) {
        throw ApiError.unauthorized('Invalid token user');
      }

      if (user.status !== 'ACTIVE') {
        throw ApiError.unauthorized('User account is not active');
      }

      const tenant = await Prisma.tenant.findUnique({
        where: {
          id: user.tenantId,
        },

        select: {
          id: true,
          name: true,
          status: true,
        },
      });

      if (!tenant) {
        throw ApiError.unauthorized('Tenant not found');
      }

      if (tenant.status !== 'ACTIVE') {
        throw ApiError.unauthorized('Tenant account is not active');
      }

      req.user = user;
      req.tenant = tenant;
      req.auth = {
        userId: user.id,
        tenantId: user.tenantId,
        roleId: user.roleId,
        role: user.role?.name || null,
        isSystemRole: user.role?.isSystem || false,
      };

      next();
    } catch (error) {
      next(error);
    }
  };

  static authorize = (roles = []) => {
    return (req, res, next) => {
      try {
        if (!req.user) {
          throw ApiError.unauthorized('User not authenticated');
        }

        // ---------------------------------------------
        // No roles supplied
        // ---------------------------------------------

        if (!Array.isArray(roles) || roles.length === 0) {
          return next();
        }

        const userRole = req.user.role?.name;

        if (!userRole) {
          throw ApiError.forbidden('User does not have a role');
        }

        // ---------------------------------------------
        // Check Role
        // ---------------------------------------------

        if (!roles.includes(userRole)) {
          throw ApiError.forbidden(`Access denied for role: ${userRole}`);
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  };

  static tenantAccess = (req, res, next) => {
    try {
      if (!req.user?.tenantId) {
        throw ApiError.unauthorized('Tenant context not found');
      }

      if (!req.tenant || req.tenant.id !== req.user.tenantId) {
        throw ApiError.forbidden('Invalid tenant access');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export default AuthMiddleware;
