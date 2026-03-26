import axios, { AxiosInstance } from 'axios';
import { secrets } from './secrets';
import toast from 'react-hot-toast';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: secrets.backendEndpoint || 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add interceptor to include token in requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async login(email: string, password: string) {
    try {
      // Get CSRF cookie for Sanctum first, though it's optional for basic token auth 
      // await this.client.get('/sanctum/csrf-cookie');
      
      const response = await this.client.post('/api/login', { email, password });
      
      if (response.data && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async register(first_name: string, last_name: string, email: string, password: string, password_confirmation: string) {
    try {
      const response = await this.client.post('/api/register', { 
        first_name, 
        last_name, 
        email, 
        password,
        password_confirmation 
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.client.post('/api/logout');
    } catch (error) {
       console.error(error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  // Handle common errors
  handleError(error: any) {
    if (error.response) {
      if (error.response.status === 422) {
        // Form validation errors
        const errors = error.response.data.errors;
        if (errors) {
            const firstErrorNode = Object.values(errors)[0] as string[];
            toast.error(firstErrorNode[0]);
            return;
        }
      }
      const msg = error.response.data.message || 'Server Error';
      toast.error(msg);
      console.error(`API Error: ${error.response.status} - ${msg}`);
    } else if (error.request) {
      toast.error('Network error - no response received');
      console.error('API Error: No response received', error.request);
    } else {
      toast.error(error.message || 'Something went wrong');
      console.error('API Error:', error.message);
    }
  }
}

export default new ApiClient(); // Export instance for easier use unless already structured otherwise
