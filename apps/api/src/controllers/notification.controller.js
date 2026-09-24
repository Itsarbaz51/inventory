import NotificationService from '../services/notification.service.js';

class NotificationController {
  // =====================================================
  // CREATE
  // =====================================================

  async create(req, res) {
    try {
      const tenantId = req.user.tenantId;

      const notification = await NotificationService.create(req.body, tenantId);

      return res.status(201).json({
        success: true,
        message: 'Notification created successfully',
        data: notification,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================================================
  // GET BY ID
  // =====================================================

  async getById(req, res) {
    try {
      const tenantId = req.user.tenantId;

      const notification = await NotificationService.getById(
        req.params.id,
        tenantId,
      );

      return res.status(200).json({
        success: true,
        message: 'Notification fetched successfully',
        data: notification,
      });
    } catch (error) {
      const status = error.message === 'Notification not found' ? 404 : 400;

      return res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================================================
  // GET ALL
  // =====================================================

  async getAll(req, res) {
    try {
      const tenantId = req.user.tenantId;

      const result = await NotificationService.getAll(req.query, tenantId);

      return res.status(200).json({
        success: true,
        message: 'Notifications fetched successfully',

        data: result.notifications,

        unreadCount: result.unreadCount,

        pagination: result.pagination,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================================================
  // MARK AS READ
  // =====================================================

  async markAsRead(req, res) {
    try {
      const tenantId = req.user.tenantId;

      const notification = await NotificationService.markAsRead(
        req.params.id,
        tenantId,
      );

      return res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        data: notification,
      });
    } catch (error) {
      const status = error.message === 'Notification not found' ? 404 : 400;

      return res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  async markAllAsRead(req, res) {
    try {
      const tenantId = req.user.tenantId;

      const userId = req.body.userId || null;

      const result = await NotificationService.markAllAsRead(tenantId, userId);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          count: result.count,
        },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================================================
  // DELETE
  // =====================================================

  async delete(req, res) {
    try {
      const tenantId = req.user.tenantId;

      const result = await NotificationService.delete(req.params.id, tenantId);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          id: result.id,
        },
      });
    } catch (error) {
      const status = error.message === 'Notification not found' ? 404 : 400;

      return res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new NotificationController();
