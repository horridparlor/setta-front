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

    const response = await apiClient.GET('/admin/users', { headers });

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

export const createUser = async (userData: {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  penName?: string;
  email?: string;
  phoneNumber?: string;
  isActive?: boolean;
  roleId?: number;
  accessRights: object;
}) => {
  try {
    console.log('User data being sent:', userData);
    const authToken = Cookies.get(AuthCookie.AUTH_TOKEN);
    const headers = {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    };

    const response = await apiClient.POST('/admin/user', {
      headers,
      body: userData,
    });

    if (response.error) {
      console.error('API Error:', response.error);
      throw new Error(response.error.error);
    }

    if (response.data) {
      console.log('User created successfully:', response.data);
      return response.data;
    } else {
      console.error('Unexpected response format:', response);
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const deleteUser = async (
  userId: number,
  deleteAllTheirContent = true
) => {
  try {
    const authToken = Cookies.get(AuthCookie.AUTH_TOKEN);
    const headers = {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    };

    const response = await apiClient.DELETE('/admin/user', {
      headers,
      body: JSON.stringify({ userId, deleteAllTheirContent }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend Error:', errorText);
      throw new Error('Failed to delete user');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
