import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/system/Grid';

const rowContainerStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 2,
  marginBottom: 2,
  display: 'flex',
};
const initialDecks = [
  { name: 'Deck 1', count: 3 },
  { name: 'Deck 2', count: 5 },
  { name: 'Deck 3', count: 1 },
];
const otherDecks = [];

const DeckTab: React.FC = () => {
  const [decks, setDecks] = useState(initialDecks);
  const [open, setOpen] = useState(false);
  const handleIncrement = name => {
    setDecks(prevDecks => {
      return prevDecks.map(deck =>
        deck.name === name ? { ...deck, count: deck.count + 1 } : deck
      );
    });
  };
  // Function to handle decrement
  const handleDecrement = name => {
    setDecks(prevDecks => {
      return prevDecks.map(deck =>
        deck.name === name && deck.count > 0
          ? { ...deck, count: deck.count - 1 }
          : deck
      );
    });
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { t } = useTranslation();
  return (
    <Box>
      <Box sx={rowContainerStyle}>
        <Typography variant="h5">This card is included in {} decks</Typography>
        <Button
          sx={{ color: 'purple' }}
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          {t('CREATE_A_DECK_WITH_THIS_CARD')}
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Deck name</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              fullWidth
              placeholder="Value"
              variant="outlined"
              margin="dense"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            color="info"
            component="label"
            onClick={() => {
              /* Add create logic here */ handleClose();
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography sx={{ marginRight: 2 }} variant="subtitle1">
              My unreleased decks {}
            </Typography>
            <Button variant="outlined" startIcon={<RefreshIcon />}>
              {t('UPDATE_CHANGES')}
            </Button>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {decks.map(deck => (
            <Grid>
              <Box sx={rowContainerStyle}>
                <IconButton onClick={() => handleDecrement(deck.name)}>
                  <RemoveIcon />
                </IconButton>
                <TableCell>{deck.count}</TableCell>
                <IconButton onClick={() => handleIncrement(deck.name)}>
                  <AddIcon />
                </IconButton>
                <Typography>{deck.name}</Typography>
              </Box>
            </Grid>
          ))}
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography sx={{ marginRight: 2 }} variant="subtitle1">
              Released decks ({})
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {decks.length > 0 && (
            <>
              <Typography sx={{ fontWeight: 'bold' }}>My decks ({})</Typography>
              {decks.map(deck => (
                <Grid>
                  <Box sx={rowContainerStyle}>
                    <TableCell>{deck.count}</TableCell>
                    <Typography>{deck.name}</Typography>
                  </Box>
                </Grid>
              ))}
            </>
          )}
        </AccordionDetails>
        <AccordionDetails>
          {decks.length > 0 && (
            <>
              <Typography sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                Other decks ({})
              </Typography>
              {decks.map(deck => (
                <Grid>
                  <Box sx={rowContainerStyle}>
                    <TableCell>Created by {}</TableCell>
                    <Typography>{deck.name}</Typography>
                  </Box>
                </Grid>
              ))}
            </>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default DeckTab;

/*
<TableContainer>
        <Box display="flex">
          <Typography variant="h6">Unreleased decks</Typography>
          <Button variant="outlined" startIcon={<RefreshIcon />}>{t("UPDATE_CHANGES")}</Button>
        </Box>
        <Table>
          <TableBody>
            {decks.map((deck, index) => (
              <TableRow key={index}>
                <TableCell>
                  <IconButton onClick={() => handleDecrement(index)}></IconButton>
                  <IconButton onClick={() => handleIncrement(index)}></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
*/
