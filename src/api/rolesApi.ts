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
