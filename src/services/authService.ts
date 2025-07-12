import api from './api';

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  // Mock login - replace with actual API call
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === 'demo@stackit.com' && credentials.password === 'password') {
          const mockResponse: AuthResponse = {
            token: 'mock_jwt_token_' + Date.now(),
            user: {
              id: '1',
              email: credentials.email,
              username: 'demo_user',
              createdAt: new Date().toISOString(),
            },
          };
          resolve(mockResponse);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }

  // Mock register - replace with actual API call
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse: AuthResponse = {
          token: 'mock_jwt_token_' + Date.now(),
          user: {
            id: Date.now().toString(),
            email: credentials.email,
            username: credentials.username,
            createdAt: new Date().toISOString(),
          },
        };
        resolve(mockResponse);
      }, 1000);
    });
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  saveAuthData(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
  }
}

export default new AuthService();