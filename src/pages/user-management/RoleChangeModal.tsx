import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { UserWithRole, useUsersWithRoles } from './userUsersAndRoles';
import { UserRole } from '../../api/types';
import { updateUser } from '../../api/userManagementApi';
import { toast } from 'react-toastify';

interface RoleChangeModalProps {
  open: boolean;
  onClose: () => void;
  initialSelectedUsers: UserWithRole[];
}

const RoleChangeModal: React.FC<RoleChangeModalProps> = ({
  open,
  onClose,
  initialSelectedUsers,
}) => {
  const { roles, usersWithRoles, refetchUsersAndRoles } = useUsersWithRoles();
  const [isChecked, setIsChecked] = useState(false);
  const [selectedUserRole, setSelectedUserRole] = useState<UserRole | null>(
    null
  );
  const [selectedUserRows, setSelectedUserRows] = useState<number[]>([]);

  useEffect(() => {
    if (open) {
      setSelectedUserRows(initialSelectedUsers.map(user => user.id));
      setIsChecked(false);
    }
  }, [open, initialSelectedUsers]);

  const handleSubmitRoleChanges = async () => {
    // Fetch api call to update user roles
    if (!selectedUserRole) {
      toast.error('Please select a role to update for the users');
      return;
    }

    const selectedUsers = usersWithRoles.filter(user =>
      selectedUserRows.includes(user.id)
    );

    for (const user of selectedUsers) {
      if (user.role && user.role.id === selectedUserRole?.id) continue;

      try {
        await updateUser({
          ...user,
          userId: user.id,
          roleId: selectedUserRole?.id,
          isActive: Boolean(user.isActive),
          accessRights: selectedUserRole?.accessRights ?? {},
        });
        toast.success(
          `Role of user ${user.firstname} ${user.lastname} updated`
        );
      } catch (error) {
        console.error('Error updating user role:', error);
        toast.error(
          `Error updating role of user ${user.firstname} ${user.lastname} `
        );
      }
    }

    await refetchUsersAndRoles();
    onClose();
  };

  const gridColumns: GridColDef<UserWithRole>[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      valueGetter: (_, row) => `${row.firstname} ${row.lastname}`,
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      valueGetter: (_, row) => row.role?.name ?? 'Unkown role name',
    },
  ];

  const isSaveButtonDisabled = !isChecked || selectedUserRows.length === 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle align="center">Change User Roles</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <DataGrid
            rows={usersWithRoles.filter(user =>
              initialSelectedUsers.some(
                selectedUser => selectedUser.id === user.id
              )
            )}
            columns={gridColumns}
            checkboxSelection
            rowSelectionModel={selectedUserRows}
            onRowSelectionModelChange={newSelection => {
              setSelectedUserRows(newSelection as number[]);
            }}
            getRowId={row => row.id}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 2,
            mb: 2,
          }}
        >
          <Typography>Select a new role for selected users:</Typography>
          <FormControl variant="outlined" sx={{ width: '30%' }}>
            <InputLabel id="select-role">Select Role</InputLabel>
            <Select<number>
              id="select-role"
              label="select-role"
              value={selectedUserRole?.id ?? -1}
              onChange={event => {
                setSelectedUserRole(
                  roles.find(role => role.id === event.target.value) ?? null
                );
              }}
            >
              {roles.map(role => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <WarningIcon color="warning" fontSize="medium" />
          <Typography style={{ marginLeft: '8px' }}>
            Changing user role will change user's access rights accordingly.
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={isChecked}
                onChange={e => setIsChecked(e.target.checked)}
              />
            }
            label="I Understand"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button sx={{ ml: 'auto' }} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ ml: 'auto' }}
          onClick={handleSubmitRoleChanges}
          disabled={isSaveButtonDisabled}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleChangeModal;
