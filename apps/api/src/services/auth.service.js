import { ApiError } from '../utils/ApiError.js';
import Prisma from '../database/db.js';
import CryptoService from '../utils/crypto.utils.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { envConfig } from '../config/index.js';
import { emailQueue } from '../queues/email.queue.js';
import crypto from 'node:crypto';

class AuthServices {
  // LOGIN
  static async login(payload) {
    const { identify, password } = payload;

    if (!identify || !password) {
      throw ApiError.badRequest('Email and password are required');
    }

    const identifier = identify.trim().toLowerCase();

    const user = await Prisma.user.findFirst({
      where: {
        OR: [
          {
            email: identifier,
          },
          {
            userNumber: identifier,
          },
          {
            phone: identify.trim(),
          },
        ],
      },

      include: {
        role: {
          select: {
            id: true,
            name: true,
            description: true,
            isSystem: true,
          },
        },

        tenant: {
          select: {
            id: true,
            name: true,
            businessName: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw ApiError.unauthorized('User account is not active');
    }

    if (!user.tenant) {
      throw ApiError.unauthorized('Tenant not found');
    }

    if (user.tenant.status !== 'ACTIVE') {
      throw ApiError.unauthorized('Tenant account is not active');
    }

    if (!user.role) {
      throw ApiError.unauthorized('User role not assigned');
    }

    const decryptedPassword = CryptoService.decrypt(user.password);

    if (decryptedPassword !== password) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    const tokenPayload = {
      id: user.id,
      tenantId: user.tenantId,
      roleId: user.roleId,
    };

    const accessToken = generateAccessToken(tokenPayload);

    const refreshToken = generateRefreshToken(tokenPayload);

    await Prisma.user.update({
      where: {
        id: user.id,
      },

      data: {
        refreshToken,
        lastLoginAt: new Date(),
      },
    });

    const {
      password: _password,
      refreshToken: _refreshToken,
      passwordForgotToken: _passwordForgotToken,
      passwordForgotExpires: _passwordForgotExpires,
      ...safeUser
    } = user;

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }

  // CURRENT USER
  static async me(userId) {
    const user = await Prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        tenantId: true,

        name: true,
        email: true,
        phone: true,

        status: true,

        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,

        role: {
          select: {
            id: true,
            name: true,
            description: true,
            isSystem: true,

            rolePermissions: {
              select: {
                permission: {
                  select: {
                    id: true,
                    module: true,
                    action: true,
                    description: true,
                  },
                },
              },
            },
          },
        },

        tenant: {
          select: {
            id: true,
            name: true,
            businessName: true,

            email: true,
            phone: true,

            gstNumber: true,
            panNumber: true,
            businessType: true,

            logo: true,

            address: true,
            city: true,
            state: true,
            pincode: true,
            country: true,

            status: true,
          },
        },
      },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  }

  // FORGOT PASSWORD
  static async forgotPassword(email) {
    if (!email) {
      throw ApiError.badRequest('Email is required');
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await Prisma.user.findFirst({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    // -----------------------------------------------
    // Rate Limit
    // -----------------------------------------------

    if (
      user.lastPasswordForgot &&
      Date.now() - new Date(user.lastPasswordForgot).getTime() < 60 * 1000
    ) {
      throw ApiError.badRequest('Please wait before requesting again');
    }

    // -----------------------------------------------
    // Generate Reset Token
    // -----------------------------------------------

    const resetToken = crypto.randomBytes(32).toString('hex');

    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    await Prisma.user.update({
      where: {
        id: user.id,
      },

      data: {
        passwordForgotToken: hashedToken,

        passwordForgotExpires: new Date(Date.now() + 15 * 60 * 1000),

        lastPasswordForgot: new Date(),
      },
    });

    // -----------------------------------------------
    // Forgot Password URL
    // -----------------------------------------------

    const forgotUrl =
      `${envConfig.API_BASE_URL}` +
      `/forgot-password-verify?token=${resetToken}`;

    // -----------------------------------------------
    // Email Queue
    // -----------------------------------------------

    await emailQueue.add(
      'forgot-password',
      {
        email: user.email,
        name: user.name,
        forgotUrl,
      },
      {
        attempts: 3,

        backoff: {
          type: 'exponential',
          delay: 5000,
        },

        removeOnComplete: true,
      },
    );

    return true;
  }

  // VERIFY FORGOT PASSWORD
  static async forgotPasswordVerify(payload) {
    const { token, password } = payload;

    if (!token || !password) {
      throw ApiError.badRequest('Token and password are required');
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await Prisma.user.findFirst({
      where: {
        passwordForgotToken: hashedToken,

        passwordForgotExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw ApiError.badRequest('Invalid or expired token');
    }

    const encryptedPassword = CryptoService.encrypt(password);

    await Prisma.user.update({
      where: {
        id: user.id,
      },

      data: {
        password: encryptedPassword,

        passwordForgotToken: null,

        passwordForgotExpires: null,

        lastPasswordChange: new Date(),
      },
    });

    return true;
  }

  // RESET PASSWORD
  static async resetPassword(userId, payload) {
    const { oldPassword, newPassword } = payload;

    if (!oldPassword || !newPassword) {
      throw ApiError.badRequest('Old password and new password are required');
    }

    const user = await Prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    // -----------------------------------------------
    // Check Old Password
    // -----------------------------------------------

    const currentPassword = CryptoService.decrypt(user.password);

    if (currentPassword !== oldPassword) {
      throw ApiError.unauthorized('Old password incorrect');
    }

    // -----------------------------------------------
    // Same Password
    // -----------------------------------------------

    if (newPassword === currentPassword) {
      throw ApiError.badRequest('New password cannot be same as old password');
    }

    // -----------------------------------------------
    // Update Password
    // -----------------------------------------------

    const encryptedPassword = CryptoService.encrypt(newPassword);

    await Prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        password: encryptedPassword,

        lastPasswordChange: new Date(),

        // Invalidate existing refresh token
        refreshToken: null,
      },
    });

    return true;
  }

  // LOGOUT
  static async logout(userId) {
    const user = await Prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    await Prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        refreshToken: null,
      },
    });

    return true;
  }
}

export default AuthServices;
