import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
} from '@mui/material';
import { forwardRef, useState } from 'react';
import WarningIcon from '@mui/icons-material/Warning';
import { useTranslation } from 'react-i18next';

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
  confirmText?: string;
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
      confirmText,
    },
    ref
  ) => {
    const { t } = useTranslation();
    const [isChecked, setIsChecked] = useState(false);
    const isSaveButtonDisabled = !isChecked;

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
                  data-testid="i-understand-checkbox"
                  checked={isChecked}
                  onChange={e => setIsChecked(e.target.checked)}
                />
              }
              label="I Understand"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{cancelText ?? t('CANCEL')}</Button>
          <Button
            data-testid="confirm-button"
            color="error"
            onClick={handleConfirm}
            autoFocus
            disabled={isSaveButtonDisabled}
          >
            {confirmText ?? t('CONFIRM')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);
export default ConfirmationDialog;
