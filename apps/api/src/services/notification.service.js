import Prisma from "../database/db.js";

class NotificationService {
  // =====================================================
  // CREATE
  // =====================================================

  async create(data, tenantId) {
    const {
      userId,
      type,
      title,
      message,
      referenceId,
    } = data;

    // -------------------------------------------------
    // If notification is for a specific user
    // -------------------------------------------------

    if (userId) {
      const user = await Prisma.user.findFirst({
        where: {
          id: userId,
          tenantId,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }
    }

    // -------------------------------------------------
    // Create notification
    // -------------------------------------------------

    const notification =
      await Prisma.notification.create({
        data: {
          tenantId,

          userId: userId || null,

          type,
          title,
          message,

          referenceId:
            referenceId || null,
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

    return notification;
  }

  // =====================================================
  // GET BY ID
  // =====================================================

  async getById(id, tenantId) {
    const notification =
      await Prisma.notification.findFirst({
        where: {
          id,
          tenantId,
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

    if (!notification) {
      throw new Error("Notification not found");
    }

    return notification;
  }

  // =====================================================
  // GET ALL
  // =====================================================

  async getAll(query, tenantId) {
    const {
      userId,
      type,
      isRead,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const where = {
      tenantId,
    };

    if (userId) {
      where.userId = userId;
    }

    if (type) {
      where.type = type;
    }

    if (typeof isRead === "boolean") {
      where.isRead = isRead;
    }

    const [
      notifications,
      total,
      unreadCount,
    ] = await Prisma.$transaction([
      Prisma.notification.findMany({
        where,

        skip,
        take: limit,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),

      Prisma.notification.count({
        where,
      }),

      Prisma.notification.count({
        where: {
          tenantId,
          ...(userId ? { userId } : {}),
          isRead: false,
        },
      }),
    ]);

    return {
      notifications,

      unreadCount,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit
        ),
      },
    };
  }

  // =====================================================
  // MARK AS READ
  // =====================================================

  async markAsRead(id, tenantId) {
    const notification =
      await Prisma.notification.findFirst({
        where: {
          id,
          tenantId,
        },
      });

    if (!notification) {
      throw new Error("Notification not found");
    }

    const updated =
      await Prisma.notification.update({
        where: {
          id,
        },

        data: {
          isRead: true,
        },
      });

    return updated;
  }

  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  async markAllAsRead(tenantId, userId = null) {
    const where = {
      tenantId,
      isRead: false,
    };

    if (userId) {
      where.userId = userId;
    }

    const result =
      await Prisma.notification.updateMany({
        where,

        data: {
          isRead: true,
        },
      });

    return {
      count: result.count,
      message:
        "Notifications marked as read successfully",
    };
  }

  // =====================================================
  // DELETE
  // =====================================================

  async delete(id, tenantId) {
    const notification =
      await Prisma.notification.findFirst({
        where: {
          id,
          tenantId,
        },
      });

    if (!notification) {
      throw new Error("Notification not found");
    }

    await Prisma.notification.delete({
      where: {
        id,
      },
    });

    return {
      id,
      message:
        "Notification deleted successfully",
    };
  }
}

export default new NotificationService();