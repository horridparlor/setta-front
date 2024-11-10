import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { User } from '../../api/types';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

interface RoleChangeModalProps {
  open: boolean;
  onClose: () => void;
  selectedUsers: User[];
}

const RoleChangeModal: React.FC<RoleChangeModalProps> = ({
  open,
  onClose,
  selectedUsers,
}) => {
  const [selectedUserRows, setSelectedUserRows] =
    useState<GridRowSelectionModel>(selectedUsers.map(user => user.id));

  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedUserRows(selectedUsers.map(user => user.id));
      setIsChecked(false);
    }
  }, [open, selectedUsers]);

  const gridColumns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
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
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            mt: 2,
            mb: 2,
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
          onClick={onClose}
          disabled={isSaveButtonDisabled}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleChangeModal;
