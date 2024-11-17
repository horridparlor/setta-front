import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { forwardRef } from 'react';
import WarningIcon from '@mui/icons-material/Warning';

export interface DiscardDialogRef {
  handleSave: () => void;
}

interface ConfirmationDialogProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  titleText: string;
  contentText?: string;
  cancelText?: string;
  discardText?: string;
}

const ConfirmationDialog = forwardRef<HTMLDivElement, ConfirmationDialogProps>(
  (
    {
      open,
      handleClose,
      handleConfirm,
      titleText,
      contentText,
      cancelText,
      discardText,
    },
    ref
  ) => {
    return (
      <Dialog open={open} onClose={handleClose} ref={ref}>
        <DialogTitle align="center" id="alert-dialog-title">
          {titleText}
        </DialogTitle>
        <IconButton color="warning">
          <WarningIcon fontSize="large" />
        </IconButton>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {contentText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{cancelText}</Button>
          <Button onClick={handleConfirm} autoFocus>
            {discardText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);
export default ConfirmationDialog;
