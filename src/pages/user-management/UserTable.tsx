import { Edit, Delete, Check, Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { UserRole } from '../../api/types';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { AppPage } from '../../types/navigation';
import { UserWithRole, useUsersWithRoles } from './userUsersAndRoles';
import RoleChangeModal from './RoleChangeModal';
import DeleteUserDialog from './DeleteUserDialog';
import { deleteUser } from '../../api/userManagementApi';

export type StatusChipProps = {
  isActive: boolean;
};

export const StatusChip: React.FC<StatusChipProps> = ({ isActive }) => (
  <Tooltip title={isActive ? 'Deactivate' : 'Activate'}>
    <Chip
      clickable
      label={isActive ? 'Active' : 'Deactivated'}
      color={isActive ? 'success' : 'error'}
      icon={isActive ? <Close /> : <Check />}
    />
  </Tooltip>
);

export const UserTable: React.FC = () => {
  const { usersWithRoles: users, refetchUsersAndRoles: refetchUsers } =
    useUsersWithRoles();

  // Filter out only roles that are assigned to users
  const rolesOfUsers = useMemo(() => {
    const roles: UserRole[] = [];
    users.forEach(user => {
      if (user.role && !roles.find(role => role.id === user.roleId)) {
        roles.push(user.role);
      }
    });
    return roles;
  }, [users]);
  const navigate = useNavigate();
  const [selectedUserRole, setSelectedUserRole] = useState<UserRole | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [selectedUserRows, setSelectedUserRows] =
    useState<GridRowSelectionModel>([]);
  const handleDeleteIconClick = (user: UserWithRole) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };
  const [isRoleChangeDialogOpen, setRoleChangeDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      await refetchUsers();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleUserSelectionChange = (newSelection: GridRowSelectionModel) => {
    setSelectedUserRows(newSelection);
  };

  const handleCreateNewUserClick = () => {
    navigate(AppPage.UserCreation);
  };

  const handleChangeRoleClick = () => {
    setRoleChangeDialogOpen(true);
  };

  const handleRoleFilterSelect = (role: UserRole | null) => {
    setSelectedUserRole(role);
    if (role === null) {
      setSelectedUserRows([]);
      return;
    }
    const newSelection = users
      .filter(user => user.roleId === role?.id)
      .map(user => user.id);
    setSelectedUserRows(newSelection);
  };

  const userColumns: GridColDef<UserWithRole>[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      valueGetter: (_value, row) => {
        return `${row.firstname} ${row.lastname}`;
      },
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      valueGetter: (_value, row) => {
        return row.role?.name ?? 'Unknown role name';
      },
    },
    { field: 'username', headerName: 'Username', flex: 1 },
    {
      field: 'activeRequest',
      headerName: 'Requests',
      flex: 1,
      renderCell: params => {
        const activeTokenRequest = !!params.row.tokenRequest;
        if (activeTokenRequest) {
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
    { field: 'id', headerName: 'UserID', width: 80 },
    {
      field: 'active',
      headerName: 'Status',
      flex: 1,
      renderCell: params => <StatusChip isActive={params.row.isActive} />,
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
    <>
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
              <Select<number>
                id="select-role"
                label="select-role"
                value={selectedUserRole?.id ?? -1}
                onChange={event => {
                  const roleFromId = rolesOfUsers.find(
                    role => role.id === event.target.value
                  );
                  handleRoleFilterSelect(roleFromId ?? null);
                }}
              >
                <MenuItem value={-1}>Show All</MenuItem>
                {rolesOfUsers.map(role => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
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
            {selectedUserRows.length > 0 && (
              <Button
                variant="contained"
                sx={{ ml: 'auto' }}
                onClick={handleChangeRoleClick}
              >
                Change Role
              </Button>
            )}
            <Button
              variant="contained"
              sx={{ ml: 'auto' }}
              onClick={handleCreateNewUserClick}
            >
              Create a New User
            </Button>
            {isRoleChangeDialogOpen && (
              <RoleChangeModal
                open={isRoleChangeDialogOpen}
                onClose={() => setRoleChangeDialogOpen(false)}
                initialSelectedUsers={users.filter(user =>
                  selectedUserRows.includes(user.id)
                )}
              />
            )}
          </Box>
          <Box sx={{ mt: 2 }}>
            <DataGrid
              rows={
                selectedUserRole
                  ? users.filter(user => user.roleId === selectedUserRole?.id)
                  : users
              }
              columns={userColumns}
              onRowSelectionModelChange={handleUserSelectionChange}
              rowSelectionModel={selectedUserRows}
              checkboxSelection={selectedUserRows.length > 0}
              // pagination not ready
            />
          </Box>
        </CardContent>
      </Card>

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        user={selectedUser}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteUser}
      />
    </>
  );
};
