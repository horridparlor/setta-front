import { useCallback, useEffect, useState } from 'react';
import { User, UserRole } from '../api/types';
import { toast } from 'react-toastify';
import { fetchUsers } from '../api/userManagementApi';
import { listRoles } from '../api/rolesApi';

export type UserWithRole = User & { role: UserRole | null };

export const useUsersWithRoles = () => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [usersWithRoles, setUsersWithRoles] = useState<UserWithRole[]>([]);

  const fetchUsersAndRoles = useCallback(async () => {
    setIsLoading(true);

    try {
      const roles = await listRoles();
      const patchedRoles = roles.map(r => ({
        ...r,
        name: r.name ?? (r.id === 2 ? 'Admin' : 'Standard user'),
      }));

      const users = await fetchUsers();
      const patchedUsers: UserWithRole[] = users.map(user => {
        const role = patchedRoles.find(role => role.id === user.roleId);
        return { ...user, role: role ?? null };
      });

      setRoles(patchedRoles);
      setUsersWithRoles(patchedUsers);
      setError(null);
      setIsLoading(false);
    } catch (error: any) {
      toast.error('Failed to fetch users with roles');
      setError('Failed to fetch users with roles');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  return { roles, usersWithRoles, isLoading, error, fetchUsersAndRoles };
};
