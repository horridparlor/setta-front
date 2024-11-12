// userManagementApi.ts
import { apiClient } from './client';
import Cookies from 'js-cookie';
import { AuthCookie } from '../types/cookie';

//how to use:
//        import { fetchLoggedInUser } from '../../api/userManagementApi';
//        const userData = await fetchLoggedInUser();
//        console.log('Logged-in User Data:', userData); to see the whole user object for currently logged in user
export const fetchLoggedInUser = async () => {
  try {
    const authToken = Cookies.get(AuthCookie.AUTH_TOKEN);
    const userId = Cookies.get(AuthCookie.USER_ID);

    if (!authToken || !userId) {
      throw new Error('Authentication token or user ID missing');
    }

    const headers = {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    };

    const response = await apiClient.GET(`/admin/user?userId=${userId}`, {
      headers,
    });

    if (response.error) {
      console.error('API Error:', response.error);
      throw new Error(response.error);
    }

    if (response.data) {
      console.log('Fetched User Data:', response.data);
      return response.data; // This is the logged-in user's data object
    } else {
      console.error('Unexpected response format:', response);
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('Error fetching logged-in user data:', error);
    throw error;
  }
};

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
      body: {
        userId: userId,
        deleteAllTheirContent: deleteAllTheirContent,
      },
    });

    const responseData = await response;
    return responseData;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

//returns the user data object
export const fetchUserById = async (userId: any) => {
  try {
    const authToken = Cookies.get(AuthCookie.AUTH_TOKEN);

    if (!authToken) {
      throw new Error('Authentication token missing');
    }

    const headers = {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    };

    const response = await apiClient.GET(`/admin/user?userId=${userId}`, {
      headers,
    });

    if (response.error) {
      console.error('API Error:', response.error);
      throw new Error(response.error);
    }

    if (response.data) {
      //for test, removve before production
      console.log('Fetched User Data:', response.data);
      return response.data;
    } else {
      console.error('Unexpected response format:', response);
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};
