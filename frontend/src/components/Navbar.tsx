import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, Plus, User, LogOut, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Badge } from './ui/badge';
import notificationService, { Notification } from '../services/notificationService';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (user) {
      try {
        const userNotifications = await notificationService.getUserNotifications(user.id);
        setNotifications(userNotifications);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      }
    }
  };

  const loadUnreadCount = async () => {
    if (user) {
      try {
        const count = await notificationService.getUnreadCount(user.id);
        setUnreadCount(count);
      } catch (error) {
        console.error('Failed to load unread count:', error);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await notificationService.markAsRead(notification.id);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      );
    }
    
    setNotificationOpen(false);
    
    if (notification.questionId) {
      navigate(`/question/${notification.questionId}`);
    }
  };

  const markAllAsRead = async () => {
    if (user) {
      await notificationService.markAllAsRead(user.id);
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 brand-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold brand-gradient bg-clip-text text-transparent">
              StackIt
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Ask Question Button */}
                <Button
                  asChild
                  className="brand-gradient hover:opacity-90 text-white font-medium"
                >
                  <Link to="/ask">
                    <Plus className="w-4 h-4 mr-2" />
                    Ask Question
                  </Link>
                </Button>

                {/* Notifications */}
                <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="text-xs"
                          >
                            Mark all as read
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b last:border-b-0 cursor-pointer hover:bg-muted transition-colors ${
                              !notification.read ? 'bg-accent' : ''
                            }`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-1">
                                <p className="text-sm">{notification.message}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(notification.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div>
                        <p className="font-medium">{user?.username}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="brand-gradient">
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;