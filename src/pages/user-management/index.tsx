import { useRef } from 'react';
import { Box } from '@mui/material';
import HomeBar, { HomeBarRef } from '../../components/common/HomeBar';
import { RoleTable } from './RoleTable';
import { UserTable } from './UserTable';
import { useUsersWithRoles } from '../../hooks/useUsersWithRoles';

interface UserManagementPageProps {
  refetch: () => Promise<void>;
}

const UserManagementPage = (props: UserManagementPageProps) => {
  const { refetch } = props;
  const homeBarRef = useRef<HomeBarRef>(null);

  const { roles, usersWithRoles, fetchUsersAndRoles } = useUsersWithRoles();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#244775',
        overflowX: 'hidden',
      }}
    >
      <Box sx={{ width: '100%' }}>
        <HomeBar refetch={refetch} ref={homeBarRef} />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          overflow: 'auto',
          p: 2,
        }}
      >
        <RoleTable
          roles={roles}
          users={usersWithRoles}
          refetch={fetchUsersAndRoles}
        />
        <UserTable
          roles={roles}
          users={usersWithRoles}
          refetch={fetchUsersAndRoles}
        />
      </Box>
    </Box>
  );
};

export default UserManagementPage;
