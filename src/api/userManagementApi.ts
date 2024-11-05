// userManagementApi.ts
import { apiClient } from './client';
import Cookies from 'js-cookie';
import { AuthCookie } from '../types/cookie';

export const fetchUsers = async () => {
  try {
    const authToken = Cookies.get(AuthCookie.AUTH_TOKEN);
    const headers = {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    };

    const response = await apiClient.GET('/api/admin/users', { headers });

    if (response.error) {
      console.error('API Error:', response.error);
      throw new Error('Failed to fetch users');
    }

    if (response.data) {
      console.log('Fetched Data:', response.data);
      return response.data.users;
    } else {
      console.error('Unexpected response format:', response);
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
