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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { AppPage } from '../../types/navigation';
import RoleChangeModal from './RoleChangeModal';
import { deleteUser, updateUser } from '../../api/userManagementApi';
import { useTranslation } from 'react-i18next';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import { toast } from 'react-toastify';
import { UserWithRole } from '../../hooks/useUsersWithRoles';

export type StatusChipProps = {
  isActive: boolean;
  onClick?: () => void;
  disabled?: boolean;
};

export const StatusChip: React.FC<StatusChipProps> = ({
  isActive,
  onClick,
  disabled,
}) => (
  <Tooltip title={isActive ? 'Deactivate' : 'Activate'}>
    <Chip
      disabled={disabled}
      clickable={!!onClick}
      onClick={e => {
        e.stopPropagation();
        if (onClick) {
          onClick();
        }
      }}
      label={isActive ? 'Active' : 'Deactivated'}
      color={isActive ? 'success' : 'error'}
      icon={isActive ? <Close /> : <Check />}
    />
  </Tooltip>
);

type UserTableProps = {
  roles: UserRole[];
  users: UserWithRole[];
  refetch: () => void;
};

type StatusFilter = {
  name: string;
  predicate: (user: UserWithRole) => boolean;
};

const statusFilters: Record<string, StatusFilter> = {
  'Show All': {
    name: 'Show All',
    predicate: () => true,
  },
  Active: {
    name: 'Active',
    predicate: user => user.isActive,
  },
  Deactivated: {
    name: 'Deactivated',
    predicate: user => !user.isActive,
  },
  'Token Requests': {
    name: 'Token Requests',
    predicate: user => !!user.tokenRequest,
  },
};

export const UserTable: React.FC<UserTableProps> = ({
  users,
  roles,
  refetch,
}) => {
  const { t } = useTranslation();

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
  const [selectedUserRows, setSelectedUserRows] =
    useState<GridRowSelectionModel>([]);
  const [isRoleChangeDialogOpen, setRoleChangeDialogOpen] = useState(false);
  const [isConfirmingDeletionOfUser, setIsConfirmingDeletionOfUser] =
    useState<UserWithRole | null>(null);
  const adminRoleUsersThatAreSelected = users.filter(
    u => u.roleId === 2 && selectedUserRows.includes(u.id)
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    statusFilters['Show All']
  );
  const [searchText, setSearchText] = useState('');

  const resetToInitialStates = useCallback(() => {
    setStatusFilter(statusFilters['Show All']);
    setSelectedUserRole(null);
    setSelectedUserRows([]);
    setSearchText('');
  }, []);

  const filteredUsers = useMemo(() => {
    return users
      .filter(statusFilter.predicate)
      .filter(user => !selectedUserRole || user.roleId === selectedUserRole.id)
      .filter(user => {
        const search = searchText.toLowerCase().trim();
        return (
          user.firstname.toLowerCase().includes(search) ||
          user.lastname.toLowerCase().includes(search) ||
          user.username.toLowerCase().includes(search) ||
          user.email?.toLowerCase().includes(search) ||
          user.role?.name.toLowerCase().includes(search)
        );
      });
  }, [users, statusFilter, selectedUserRole, searchText]);

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      refetch();
      setIsConfirmingDeletionOfUser(null);
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleStatusChipClick = async (user: UserWithRole) => {
    const newStatus = !user.isActive;
    console.log('Changing status of user:', user, 'to:', newStatus);
    try {
      await updateUser({
        ...user,
        userId: user.id,
        isActive: !user.isActive,
      });
      toast.success(
        `Status of user ${user.firstname} ${user.lastname} changed to ${
          newStatus ? 'active' : 'deactivated'
        }`
      );
      refetch();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error(
        `Error updating status of user ${user.firstname} ${user.lastname}`
      );
    }
  };

  // Remove selected users that are not in the list of users, for example a deletion could cause this
  useEffect(() => {
    setSelectedUserRows(prev => {
      return prev.filter(id => users.find(user => user.id === id));
    });
  }, [users]);

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
      renderCell: params => (
        <StatusChip
          disabled={params.row.roleId === 2}
          isActive={params.row.isActive}
          onClick={() => handleStatusChipClick(params.row)}
        />
      ),
    },
    {
      field: 'options',
      headerName: 'Options',
      flex: 1,
      renderCell: params => {
        return (
          <>
            <IconButton
              onClick={() => navigate(`/user-management/edit/${params.row.id}`)}
              disabled={params.row.roleId === 2}
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={() => setIsConfirmingDeletionOfUser(params.row)}
              disabled={params.row.roleId === 2}
            >
              <Delete />
            </IconButton>
          </>
        );
      },
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
              value={searchText}
              onChange={event => setSearchText(event.target.value)}
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
              <Select id="status" label="status" value={statusFilter.name}>
                {Object.keys(statusFilters).map(filterName => (
                  <MenuItem
                    key={filterName}
                    value={filterName}
                    onClick={() => setStatusFilter(statusFilters[filterName])}
                  >
                    {filterName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedUserRows.length > 0 && (
              <Tooltip
                title={
                  adminRoleUsersThatAreSelected.length > 0
                    ? 'Role modification disabled because the selection includes users with an admin role which cannot be changed'
                    : ''
                }
              >
                <span>
                  <Button
                    variant="contained"
                    sx={{ ml: 'auto' }}
                    onClick={handleChangeRoleClick}
                    disabled={adminRoleUsersThatAreSelected.length > 0}
                  >
                    Change Role
                  </Button>
                </span>
              </Tooltip>
            )}
            <Button
              variant="contained"
              data-testid="create-new-user-button"
              sx={{ ml: 'auto' }}
              onClick={handleCreateNewUserClick}
            >
              Create a New User
            </Button>
            {isRoleChangeDialogOpen && (
              <RoleChangeModal
                roles={roles}
                users={users}
                refetch={refetch}
                open={isRoleChangeDialogOpen}
                onSuccesfulSubmit={resetToInitialStates}
                onClose={() => setRoleChangeDialogOpen(false)}
                initialSelectedUsers={users.filter(user =>
                  selectedUserRows.includes(user.id)
                )}
              />
            )}
          </Box>
          <Box sx={{ mt: 2 }}>
            <DataGrid
              rows={filteredUsers}
              columns={userColumns}
              onRowSelectionModelChange={handleUserSelectionChange}
              rowSelectionModel={selectedUserRows}
              checkboxSelection={selectedUserRows.length > 0}
              // pagination not ready
            />
          </Box>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={isConfirmingDeletionOfUser !== null}
        handleClose={() => setIsConfirmingDeletionOfUser(null)}
        handleConfirm={() =>
          handleDeleteUser(isConfirmingDeletionOfUser?.id ?? -1)
        }
        contentText={`Are you sure you want to delete the user ${isConfirmingDeletionOfUser?.firstname} ${isConfirmingDeletionOfUser?.lastname} with role ${isConfirmingDeletionOfUser?.role?.name}? This user account will be deleted permanently and cannot be recovered.`}
        titleText={'Delete user'}
        confirmText={t('DELETE')}
      />
    </>
  );
};
