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
import { fetchUsers } from '../../api/userManagementApi';

interface UserManagementPageProps {
  refetch: () => Promise<void>;
}

const UserManagementPage = (props: UserManagementPageProps) => {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);
  const { refetch } = props;
  const homeBarRef = useRef<HomeBarRef>(null);
  const navigate = useNavigate();
  // mock data
  const testRoles = [
    {
      id: 1,
      role: 'SuperAdmin',
      custom: false,
      lastedited: 'dd/mm/yyyy',
      active: true,
    },
    {
      id: 2,
      role: 'Admin',
      custom: false,
      lastedited: 'dd/mm/yyyy',
      active: false,
    },
    {
      id: 3,
      role: 'Designer',
      custom: false,
      lastedited: 'dd/mm/yyyy',
      active: false,
    },
    {
      id: 4,
      role: 'Releaser',
      custom: false,
      lastedited: 'dd/mm/yyyy',
      active: true,
    },
    {
      id: 5,
      role: 'Junior Designer',
      custom: true,
      lastedited: 'dd/mm/yyyy',
      active: true,
    },
  ];
  // mock data
  const testUsers = [
    {
      name: 'Firstname Lastname',
      role: 'userRole',
      username: 'userName',
      activeRequest: true,
      id: '1',
      active: true,
    },
    {
      name: 'Firstname Lastname',
      role: 'userRole',
      username: 'userName',
      activeRequest: false,
      id: '2',
      active: true,
    },
    {
      name: 'Firstname Lastname',
      role: 'userRole',
      username: 'userName',
      activeRequest: false,
      id: '3',
      active: true,
    },
    {
      name: 'Firstname Lastname',
      role: 'userRole',
      username: 'userName',
      activeRequest: true,
      id: '4',
      active: true,
    },
    {
      name: 'Firstname Lastname',
      role: 'userRole',
      username: 'userName',
      activeRequest: false,
      id: '5',
      active: false,
    },
  ];
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
        if (params.row.custom) {
          return <span>Customized</span>;
        }
        return null;
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
      renderCell: () => (
        <>
          <IconButton>
            <Edit />
          </IconButton>
          <IconButton>
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
                rows={testRoles}
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
    </Box>
  );
};

export default UserManagementPage;
