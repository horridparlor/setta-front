import React, { useState } from 'react';
import DeckValidation from './DeckValidation';
import { DeckData } from '../../pages/card-catalogue';
import {
  Box,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  Menu,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SettingsIcon from '@mui/icons-material/Settings';
import WarningIcon from '@mui/icons-material/Warning';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

interface DeckBuilderManagementProps {
  deck: DeckData[];
  deckName: string;
  handleDeckChange: (e: SelectChangeEvent) => void;
  clearDeckbuilder: () => void;
  handleCopyDeck: () => void;
  deckNameText: string;
  setDeckNameText: (value: string) => void;
  saveDeck: () => void;
  deckValidityState: 'released' | 'notValid' | string;
}
const DeckBuilderManagement: React.FC<DeckBuilderManagementProps> = ({
  deck,
  deckName,
  handleDeckChange,
  clearDeckbuilder,
  handleCopyDeck,
  deckNameText,
  setDeckNameText,
  saveDeck,
  deckValidityState,
}) => {
  const [deleteDialog, setDeleteDialog] = useState(false);
  const { deckStateMessage } = DeckValidation(deck);
  const [anchorElSettings, setAnchorElSettings] =
    React.useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const renderSelectedValue = (value: string) => {
    return value;
  };
  const handleMenuClose = () => {
    setAnchorElSettings(null);
  };
  const handleDeleteDialogClose = () => {
    setDeleteDialog(false);
    handleMenuClose();
  };
  const openSettings = Boolean(anchorElSettings);
  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElSettings(event.currentTarget);
  };
  return (
    <Box>
      <Box sx={{ m: 1 }}>
        <Button
          variant="contained"
          sx={{ marginRight: 1 }}
          onClick={() => clearDeckbuilder()}
        >
          <AddIcon sx={{ marginRight: 1 }} />
          {t('NEW_DECK')}
        </Button>
        <Button
          variant="contained"
          onClick={() => handleCopyDeck()}
          disabled={deckNameText === ''}
        >
          <ContentCopyIcon sx={{ marginRight: 1 }} /> {t('COPY_DECK')}
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <FormControl sx={{ flex: 1, mr: 1 }}>
          <InputLabel>{t('MY_DECKS')}</InputLabel>
          <Select
            value={deckName}
            onChange={handleDeckChange}
            renderValue={renderSelectedValue}
          >
            <MenuItem value="Deck 1">
              <ListItemIcon>
                <CheckCircleOutlineIcon sx={{ color: 'green' }} />
              </ListItemIcon>
              <ListItemText primary="Deck 1" />
            </MenuItem>
            <MenuItem value="Deck 2">
              <ListItemIcon>
                <CheckCircleIcon sx={{ color: 'purple' }} />
              </ListItemIcon>
              <ListItemText primary="Deck 2" />
            </MenuItem>
            <MenuItem value="Deck 3">
              <ListItemIcon>
                <ErrorIcon sx={{ color: 'red' }} />
              </ListItemIcon>
              <ListItemText primary="Deck 3" />
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ flex: 1, ml: 1 }}>
          <InputLabel>{t('OTHER_DECKS')}</InputLabel>
          <Select>
            <MenuItem>Option A</MenuItem>
            <MenuItem>Option B</MenuItem>
            <MenuItem>Option C</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
        <TextField
          variant="standard"
          value={deckNameText}
          onChange={e => setDeckNameText(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
          <Button
            variant="contained"
            color="primary"
            disabled={deckValidityState === 'released' || deckNameText === ''}
            onClick={saveDeck}
          >
            {t('SAVE')}
          </Button>
          <IconButton onClick={handleSettingsClick} color="secondary">
            <SettingsIcon />
          </IconButton>
          <Menu
            open={openSettings}
            onClose={handleMenuClose}
            anchorEl={anchorElSettings}
          >
            <MenuItem
              onClick={handleMenuClose}
              disabled={deckValidityState === 'notValid'}
            >
              <UnpublishedIcon sx={{ marginRight: 1 }} />
              {deckValidityState === 'released' ? t('UNRELEASE') : t('RELEASE')}
            </MenuItem>
            <MenuItem onClick={() => setDeleteDialog(true)}>
              <DeleteIcon color="error" sx={{ marginRight: 1 }} /> Delete
            </MenuItem>
            <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
              <DialogTitle>{t('ARE_YOU_SURE')}</DialogTitle>
              <DialogContent>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <WarningIcon color="error" />
                  <DialogContentText sx={{ marginTop: 2 }}>
                    {t(
                      'THIS_DECK_WILL_BE_DELETED_PERMANENTLY_AND_CANNOT_BE_RECOVERED'
                    )}
                  </DialogContentText>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                <Button
                  onClick={() => {
                    handleDeleteDialogClose();
                    clearDeckbuilder();
                  }}
                  color="error"
                >
                  {t('DELETE_DECK')}
                </Button>
              </DialogActions>
            </Dialog>
          </Menu>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        sx={{
          m: 1,
          p: 1,
          backgroundColor: deckStateMessage.backgroundColor,
          borderRadius: 1,
        }}
      >
        <Typography sx={{ color: deckStateMessage.color }}>
          {deckStateMessage.icon} {deckStateMessage.text}
        </Typography>
        <Button
          variant="text"
          disabled={deckValidityState === 'notValid'}
          sx={{ color: deckStateMessage.color }}
        >
          {deckValidityState === 'released' ? t('UNRELEASE') : t('RELEASE')}
        </Button>
      </Box>
    </Box>
  );
};

export default DeckBuilderManagement;
