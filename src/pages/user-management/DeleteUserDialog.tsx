// components/user-management/DeleteUserDialog.tsx
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import React from 'react';
import { UserWithRole } from './userUsersAndRoles';

interface DeleteUserDialogProps {
  open: boolean;
  user: UserWithRole | null;
  onClose: () => void;
  onConfirm: (userId: number) => void;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  open,
  user,
  onClose,
  onConfirm,
}) => {
  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete user{' '}
          <strong>
            {user.firstname} {user.lastname}
          </strong>{' '}
          with role <strong>{user.role?.name ?? 'Unkown role name'}</strong>?
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => onConfirm(user.id)}
          color="error"
          variant="contained"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserDialog;
