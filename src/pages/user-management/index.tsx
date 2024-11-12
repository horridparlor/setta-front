import { useRef, useEffect, useState } from 'react';
import {
  Box,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Chip,
  Tooltip,
  Typography,
} from '@mui/material';
import { Edit, Delete, Check, Close } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import HomeBar, { HomeBarRef } from '../../components/common/HomeBar';
import { useNavigate } from 'react-router-dom';
import { AppPage } from '../../types/navigation';
import DeleteUserDialog from './DeleteUserDialog';
import {
  fetchUsers,
  deleteUser,
  updateUser,
} from '../../api/userManagementApi';
import { listRoles } from '../../api/rolesApi';

interface UserManagementPageProps {
  refetch: () => Promise<void>;
}
interface User {
  id: number;
  name: string;
  role: string;
  username: string;
  activeRequest: boolean;
  active: boolean;
}
interface Role {
  id: number;
  role: string;
  custom: boolean;
  lastedited: string;
  active: boolean;
}
const UserManagementPage = (props: UserManagementPageProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const loadUsers = async () => {
    try {
      const fetchedData = await fetchUsers();
      if (Array.isArray(fetchedData)) {
        const formattedUsers = fetchedData.map((user: any) => ({
          id: user.id,
          name: `${user.firstname} ${user.lastname}`,
          role: user.roleId === 2 ? 'Admin' : 'Standard User', //lets uypdate this to map or somthign when we get there
          username: user.username,
          activeRequest: !!user.tokenRequest,
          active: user.isActive === 1,
        }));
        setUsers(formattedUsers);
      } else {
        console.error('Unexpected data structure:', fetchedData);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };
  const loadRoles = async () => {
    try {
      const fetchedRoles = await listRoles();
      if (Array.isArray(fetchedRoles)) {
        const formattedRoles = fetchedRoles.map((role: any) => ({
          id: role.id,
          role: role.name,
          custom: role.custom || false, // Adjust based on your data structure
          lastedited: role.lastedited || 'Unknown', // Replace with actual data if available
          active: role.isActive,
        }));
        setRoles(formattedRoles);
      } else {
        console.error('Unexpected roles data structure:', fetchedRoles);
      }
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);
  const { refetch } = props;
  const homeBarRef = useRef<HomeBarRef>(null);
  const navigate = useNavigate();

  const handleDeleteIconClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleButtonClick = () => {
    navigate(AppPage.UserCreation);
  };
  const renderStatusChip = (active: boolean) => (
    <Tooltip title={active ? 'Deactivate' : 'Activate'}>
      <Chip
        clickable
        label={active ? 'Active' : 'Deactivated'}
        color={active ? 'success' : 'error'}
        icon={active ? <Close /> : <Check />}
      />
    </Tooltip>
  );

  const roleColumns: GridColDef[] = [
    { field: 'role', headerName: 'Role', flex: 1 },
    {
      field: 'custom',
      headerName: 'Type',
      flex: 1,
      renderCell: params => {
        return params.row.custom ? <span>Customized</span> : null;
      },
    },
    { field: 'lastedited', headerName: 'Last Edited', flex: 1 },
    {
      field: 'options',
      headerName: 'Options',
      flex: 1,
      renderCell: params => (
        <>
          <IconButton>
            <Edit />
          </IconButton>
          <Tooltip title={params.row.active ? 'Role Active' : ''}>
            <span>
              <IconButton
                disabled={params.row.active}
                sx={{ color: params.row.active ? 'grey' : 'default' }}
              >
                <Delete />
              </IconButton>
            </span>
          </Tooltip>
        </>
      ),
      align: 'right',
    },
  ];

  const userColumns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    { field: 'username', headerName: 'Username', flex: 1 },
    {
      field: 'activeRequest',
      headerName: 'Requests',
      flex: 1,
      renderCell: params => {
        if (params.row.activeRequest) {
          return (
            <Chip
              label="tokenRequest"
              color="secondary"
              icon={<Typography>T</Typography>}
              clickable
            />
          );
        }
        return null;
      },
    },
    { field: 'id', headerName: 'UserID', flex: 1 },
    {
      field: 'active',
      headerName: 'Status',
      flex: 1,
      renderCell: params => renderStatusChip(params.row.active),
    },
    {
      field: 'options',
      headerName: 'Options',
      flex: 1,
      renderCell: params => (
        <>
          <IconButton>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDeleteIconClick(params.row)}>
            <Delete />
          </IconButton>
        </>
      ),
      align: 'right',
    },
  ];

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
        <Card sx={{ m: 1, p: 1, width: '90%' }}>
          <CardHeader title="Roles and Access Rights" />
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <TextField
                label="Search"
                variant="outlined"
                sx={{ width: '30%' }}
              />
              <FormControl variant="outlined" sx={{ width: '20%' }}>
                <InputLabel id="select-role">Select Role</InputLabel>
                <Select id="select-role" label="select-role">
                  // mock data
                  <MenuItem>SuperAdmin</MenuItem>
                  <MenuItem>Admin</MenuItem>
                  <MenuItem>Designer</MenuItem>
                  <MenuItem>Releaser</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" sx={{ width: '20%' }}>
                <InputLabel id="filter">Filter</InputLabel>
                <Select id="filter" label="filter">
                  <MenuItem>Show All</MenuItem>
                  <MenuItem>Customized</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" sx={{ ml: 'auto' }}>
                Create a New Role
              </Button>
            </Box>

            <Box sx={{ mt: 2 }}>
              <DataGrid
                rows={roles}
                columns={roleColumns}
                checkboxSelection={false}
                // pagination not ready
              />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ m: 1, mb: 2, p: 1, width: '90%' }}>
          <CardHeader title="Users" />
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <TextField
                label="Search name, email, etc."
                variant="outlined"
                sx={{ width: '30%' }}
              />
              <FormControl variant="outlined" sx={{ width: '20%' }}>
                <InputLabel id="select-role">Select Role</InputLabel>
                <Select id="select-role" label="select-role">
                  // mock data
                  <MenuItem>SuperAdmin</MenuItem>
                  <MenuItem>Admin</MenuItem>
                  <MenuItem>Designer</MenuItem>
                  <MenuItem>Releaser</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" sx={{ width: '20%' }}>
                <InputLabel id="filter">Status</InputLabel>
                <Select id="status" label="status">
                  <MenuItem>Show All</MenuItem>
                  <MenuItem>Active</MenuItem>
                  <MenuItem>Deactive</MenuItem>
                  <MenuItem>Token Requests</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                sx={{ ml: 'auto' }}
                onClick={handleButtonClick}
              >
                Create a New User
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <DataGrid
                rows={users}
                columns={userColumns}
                checkboxSelection
                // pagination not ready
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
      <DeleteUserDialog
        open={isDeleteDialogOpen}
        user={selectedUser}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteUser}
      />
    </Box>
  );
};

export default UserManagementPage;
