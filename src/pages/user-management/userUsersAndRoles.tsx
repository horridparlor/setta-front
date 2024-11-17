import { useCallback, useEffect, useMemo, useState } from 'react';
import { User, UserRole } from '../../api/types';
import { fetchUsers } from '../../api/userManagementApi';
import { listRoles } from '../../api/rolesApi';
import { toast } from 'react-toastify';

export type UserWithRole = User & { role: UserRole | null };

export const useUsersWithRoles = () => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [usersWithRoles, setUsersWithRoles] = useState<UserWithRole[]>([]);

  const refetchUsersAndRoles = useCallback(async () => {
    const fetchedRoles = await (
      await listRoles()
    ).map(role => ({
      ...role,
      name: role.name ?? (role.id === 2 ? 'Admin' : 'Standard user'),
      // TODO: REMOVE ASAP, THIS IS TEMPORARY BECAUSE THE BACKEND GIVES NULL FOR THE NAME FOR SOME REASON SEND HELP
    }));
    setRoles(fetchedRoles);
    const users = await fetchUsers();

    const usersWithRoles: UserWithRole[] = users.map(user => {
      const role = fetchedRoles.find(role => role.id === user.roleId);
      return { ...user, role: role ?? null };
    });

    setUsersWithRoles(usersWithRoles);
  }, []);

  useEffect(() => {
    refetchUsersAndRoles().catch(error => {
      toast.error('Failed to fetch users with roles');
      throw error;
    });
  }, []);

  const result = useMemo(
    () => ({
      roles,
      usersWithRoles,
      refetchUsersAndRoles,
    }),
    [roles, usersWithRoles, refetchUsersAndRoles]
  );

  return result;
};
