import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

interface RoleChangeModalProps {
  open: boolean;
  onClose: () => void;
}

const RoleChangeModal: React.FC<RoleChangeModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle align="center">Change User Roles</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
          }}
        >
          <WarningIcon color="warning" fontSize="medium" />
          <Typography style={{ marginLeft: '8px' }}>
            Changing user role will change user's access rights accordingly.
          </Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <Button sx={{ ml: 'auto' }} onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" sx={{ ml: 'auto' }} onClick={onClose}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleChangeModal;
