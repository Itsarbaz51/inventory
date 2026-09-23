import { ApiResponse } from '../utils/ApiResponse.js';
import { cookieOptions } from '../utils/jwt.js';
import AuthServices from '../services/auth.service.js';

class AuthController {
  // =====================================================
  // LOGIN
  // =====================================================

  static async login(req, res) {
    const result = await AuthServices.login(req.body, req);

    const { user, accessToken, refreshToken } = result;

    // Never send sensitive fields
    const {
      password,
      refreshToken: _refreshToken,
      passwordForgotToken,
      passwordForgotExpires,
      ...safeUser
    } = user;

    return res
      .status(200)

      .cookie('accessToken', accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      })

      .cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      .json(
        ApiResponse.success(
          {
            user: safeUser,
            accessToken,
          },
          'Login successful',
        ),
      );
  }

  // =====================================================
  // FORGOT PASSWORD
  // =====================================================

  static async forgotPassword(req, res) {
    await AuthServices.forgotPassword(req.body.email);

    return res.json(ApiResponse.success(null, 'Reset email sent'));
  }

  // =====================================================
  // VERIFY FORGOT PASSWORD
  // =====================================================

  static async forgotPasswordVerify(req, res) {
    await AuthServices.forgotPasswordVerify(req.body);

    return res.json(ApiResponse.success(null, 'Password reset successful'));
  }

  // =====================================================
  // RESET PASSWORD
  // =====================================================

  static async resetPassword(req, res) {
    await AuthServices.resetPassword(req.user.id, req.body);

    return res.json(ApiResponse.success(null, 'Password reset successful'));
  }

  // =====================================================
  // CURRENT USER
  // =====================================================

  static async me(req, res) {
    const user = await AuthServices.me(req.user.id);

    return res.json(ApiResponse.success(user, 'Current user fetched'));
  }

  // =====================================================
  // LOGOUT
  // =====================================================

  static async logout(req, res, next) {
    try {
      await AuthServices.logout(req.user.id);

      return res
        .clearCookie('accessToken', {
          ...cookieOptions,
        })
        .clearCookie('refreshToken', {
          ...cookieOptions,
        })
        .json(ApiResponse.success(null, 'Logout successful'));
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
