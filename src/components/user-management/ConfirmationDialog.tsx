import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import { forwardRef } from "react";
import WarningIcon from '@mui/icons-material/Warning';

export interface DiscardDialogRef {
    handleSave: () => void;
}

interface ConfirmationDialogProps {
    open: boolean;
    handleClose: () => void;
    handleDiscard: () => void;
}

const ConfirmationDialog = forwardRef<HTMLDivElement, ConfirmationDialogProps>(
    ({ open, handleClose, handleDiscard }, ref) => {
        return (
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                ref={ref}
            >
                <DialogTitle align='center' id="alert-dialog-title">
                    {"Are you sure?"}
                </DialogTitle>
                <IconButton color="warning">
                    <WarningIcon fontSize="large" />
                </IconButton>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Any unsaved changes will be lost.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>CANCEL</Button>
                    <Button onClick={handleDiscard} autoFocus>
                        DISCARD CHANGES
                    </Button>
                </DialogActions>
            </Dialog>
        )
    })
export default ConfirmationDialog;