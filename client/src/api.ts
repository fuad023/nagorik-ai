import axios, { AxiosInstance } from 'axios';
import { secrets } from './secrets';
import toast from 'react-hot-toast';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: secrets.backendEndpoint,
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
      const response = await this.client.post('/api/login', { email, password });

      if (response.data && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }

      // Server returned 2xx but no token — treat as failed auth
      const msg = response.data?.message || 'Invalid credentials';
      toast.error(msg);
      throw new Error(msg);
    } catch (error: any) {
      // Only call handleError for real HTTP/network errors (not our own thrown errors)
      if (error.response || error.request) {
        this.handleError(error);
      }
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

      if (response.data && response.data.user) {
        return response.data;
      }

      // Server returned 2xx but no user — likely a duplicate account or server issue
      const msg = response.data?.message || 'This account already exists.';
      toast.error(msg);
      throw new Error(msg);
    } catch (error: any) {
      // Only call handleError for real HTTP/network errors (not our own thrown errors)
      if (error.response || error.request) {
        this.handleError(error);
      }
      throw error;
    }
  }

  async submitReport(location: string, description: string, imageFile: File) {
    try {
      const formData = new FormData();
      formData.append('title', location);
      formData.append('description', description);
      formData.append('mk_files[]', imageFile);

      const token = localStorage.getItem('auth_token');
      const endpoint = `${secrets.backendEndpoint}/api/v1/reports`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success !== false && !data.error) {
        return data;
      }

      const msg = data.message || data.error || 'Failed to submit report.';
      toast.error(msg);
      throw new Error(msg);
    } catch (error: any) {
      if (error.response || error.request) {
        this.handleError(error);
      } else {
        toast.error(error.message || 'Network error');
      }
      throw error;
    }
  }

  async sendChatMessage(message: string) {
    try {
      const response = await this.client.post('/api/v1/chat/send', { message });
      return response.data;
    } catch (error: any) {
      if (error.response || error.request) {
        this.handleError(error);
      }
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
