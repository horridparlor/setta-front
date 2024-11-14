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
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { UserWithRole } from './userUsersAndRoles';
import { UserRole } from '../../api/types';

interface RoleChangeModalProps {
  open: boolean;
  onClose: () => void;
  selectedUsers: UserWithRole[];
  roles: UserRole[];
}

const RoleChangeModal: React.FC<RoleChangeModalProps> = ({
  open,
  onClose,
  selectedUsers,
  roles,
}) => {
  const [selectedUserRows, setSelectedUserRows] =
    useState<GridRowSelectionModel>(selectedUsers.map(user => user.id));
  const [isChecked, setIsChecked] = useState(false);
  const [selectedUserRole, setSelectedUserRole] = useState<UserRole | null>(
    null
  );

  useEffect(() => {
    if (open) {
      setSelectedUserRows(selectedUsers.map(user => user.id));
      setIsChecked(false);
    }
  }, [open, selectedUsers]);

  const handleSubmitRoleChanges = () => {
    // Fetch api call to update user roles
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
            rows={selectedUsers}
            columns={gridColumns}
            checkboxSelection
            rowSelectionModel={selectedUserRows}
            onRowSelectionModelChange={newSelection => {
              setSelectedUserRows(newSelection);
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
