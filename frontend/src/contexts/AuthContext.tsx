import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User, LoginCredentials, RegisterCredentials } from '../services/authService';
import { useToast } from '../hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already authenticated on app start
    const currentUser = authService.getCurrentUser();
    const token = authService.getToken();
    
    if (currentUser && token) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const authResponse = await authService.login(credentials);
      authService.saveAuthData(authResponse);
      setUser(authResponse.user);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setLoading(true);
      const authResponse = await authService.register(credentials);
      authService.saveAuthData(authResponse);
      setUser(authResponse.user);
      toast({
        title: "Welcome to StackIt!",
        description: "Your account has been created successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging you out.",
        variant: "destructive",
      });
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};