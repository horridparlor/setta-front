import { apiClient } from './client';
import Cookies from 'js-cookie';
import { AuthCookie } from '../types/cookie';
import { UserRole } from './types.ts';

export const createRole = async (roleData: {
  name: string;
  accessRights: Record<string, boolean>;
}) => {
  const authToken = Cookies.get(AuthCookie.AUTH_TOKEN);
  try {
    const response = await apiClient.POST('/admin/role', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: {
        name: roleData.name,
        accessRights: roleData.accessRights,
      },
    });
    console.log('POST /admin/roles response:', response);
    return response;
  } catch (error) {
    console.error('Failed to create custom role:', error);
  }
};

export const listRoles = async (): Promise<UserRole[]> => {
  try {
    const response = await apiClient.GET('/admin/roles');
    if (response.data) {
      return response.data.roles;
    } else {
      throw new Error('No roles data received');
    }
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const updateRole = async (roleData: {
  roleId: number;
  name: string;
  accessRights: Record<string, boolean>;
}) => {
  const authToken = Cookies.get(AuthCookie.AUTH_TOKEN);
  try {
    const response = await apiClient.PUT('/admin/role', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: {
        roleId: roleData.roleId,
        name: roleData.name,
        accessRights: roleData.accessRights,
      },
    });
    console.log('PUT /admin/role response:', response);

    return response;
  } catch (error) {
    console.error('Failed to update role:', error);
    throw error;
  }
};

export const deleteRole = async (roleId: number) => {
  try {
    const authToken = Cookies.get(AuthCookie.AUTH_TOKEN);

    if (!authToken) {
      throw new Error('Authentication token missing');
    }

    const headers = {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    };

    const { data } = await apiClient.DELETE(`/admin/role`, {
      headers,
      body: {
        roleId: roleId,
      },
    });

    console.log('Role deleted successfully:', data);
    return data;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};
