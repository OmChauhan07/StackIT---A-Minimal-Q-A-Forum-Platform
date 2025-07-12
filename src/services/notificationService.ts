import { User } from './authService';

export interface Notification {
  id: string;
  type: 'new_answer' | 'vote_received' | 'question_answered';
  message: string;
  questionId?: string;
  answerId?: string;
  triggeredBy: User;
  recipient: User;
  read: boolean;
  createdAt: string;
}

class NotificationService {
  private mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'new_answer',
      message: 'Your question "How to implement JWT authentication in React?" received a new answer',
      questionId: '1',
      triggeredBy: {
        id: '5',
        email: 'expert@example.com',
        username: 'auth_expert',
        createdAt: '2024-01-01T00:00:00Z',
      },
      recipient: {
        id: '1',
        email: 'demo@stackit.com',
        username: 'demo_user',
        createdAt: '2024-01-01T00:00:00Z',
      },
      read: false,
      createdAt: '2024-01-15T15:30:00Z',
    },
    {
      id: '2',
      type: 'vote_received',
      message: 'Your answer received an upvote',
      answerId: '1',
      triggeredBy: {
        id: '6',
        email: 'security@example.com',
        username: 'security_pro',
        createdAt: '2024-01-02T00:00:00Z',
      },
      recipient: {
        id: '1',
        email: 'demo@stackit.com',
        username: 'demo_user',
        createdAt: '2024-01-01T00:00:00Z',
      },
      read: false,
      createdAt: '2024-01-15T14:15:00Z',
    },
  ];

  // Mock get user notifications
  async getUserNotifications(userId: string): Promise<Notification[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notifications = this.mockNotifications
          .filter(notification => notification.recipient.id === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(notifications);
      }, 300);
    });
  }

  // Mock mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notification = this.mockNotifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;
        }
        resolve();
      }, 200);
    });
  }

  // Mock mark all notifications as read
  async markAllAsRead(userId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.mockNotifications
          .filter(n => n.recipient.id === userId)
          .forEach(n => n.read = true);
        resolve();
      }, 300);
    });
  }

  // Mock get unread count
  async getUnreadCount(userId: string): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const count = this.mockNotifications
          .filter(n => n.recipient.id === userId && !n.read).length;
        resolve(count);
      }, 200);
    });
  }

  // Mock create notification (usually called by backend)
  createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.mockNotifications.unshift(newNotification);
  }
}

export default new NotificationService();