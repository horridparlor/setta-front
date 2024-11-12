import { apiClient } from './client';
import Cookies from 'js-cookie';
import { AuthCookie } from '../types/cookie';

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

    alert('Custom role created successfully!');
  } catch (error) {
    console.error('Failed to create custom role:', error);
    alert(
      `Failed to create custom role: ${error instanceof Error ? error.message : error}`
    );
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

    alert('Role updated successfully!');
    return response;
  } catch (error) {
    console.error('Failed to update role:', error);
    alert(
      `Failed to update role: ${error instanceof Error ? error.message : error}`
    );
    throw error;
  }
};

export const updateUserRole = async (user: any) => {
  try {
    const authToken = Cookies.get(AuthCookie.AUTH_TOKEN);

    if (!authToken) {
      throw new Error('Authentication token missing');
    }

    const headers = {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    };

    const response = await apiClient.PUT(`/admin/user`, {
      headers,
      body: {
        userId: user.userId,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        penName: user.penName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isActive: user.isActive,
        roleId: user.roleId,
        accessRights: user.accessRights,
      },
    });

    const responseData = await response;
    //for seeing that it passed, remove before in production
    console.log('Updated User Role:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

export const deleteRole = async roleId => {
  try {
    const authToken = Cookies.get(AuthCookie.AUTH_TOKEN);

    if (!authToken) {
      throw new Error('Authentication token missing');
    }

    const headers = {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    };

    const response = await apiClient.DELETE(`/admin/role`, {
      headers,
      body: {
        roleId: roleId,
      },
    });

    const responseData = await response;
    console.log('Role deleted successfully:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};
