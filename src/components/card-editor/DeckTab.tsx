import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  Paper,
  styled,
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
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

const rowContainerStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 2,
  marginBottom: 2,
  display: 'flex',
};
const placeholderDeck = [
  { id: '1', name: 'Deck 1', count: 3, creator: 'Firstname Lastname' },
  { id: '2', name: 'Deck 2', count: 5, creator: 'First Last' },
  { id: '3', name: 'Deck 3', count: 1, creator: 'Etunimi Sukunimi' },
];

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  //backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(255, 255, 255, .05)',
  }),
}));



const DeckTab: React.FC = () => {
  const [decks, setDecks] = useState(placeholderDeck);
  const [open, setOpen] = useState(false);
  const [isIncluded, setIsIncluded] = useState(0);
  const [unreleasedDecks, setUnreleasedDecks] = useState(0);
  const [releasedDecks, setReleasedDecks] = useState(0);
  const [myDecks, setMyDecks] = useState(0);
  const [otherDecks, setOtherDecks] = useState(0);
  const [textFieldValue, setTextFieldValue] = useState('');

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
  const handleTextFieldChange = (event) => {
    setTextFieldValue(event.target.value);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setTextFieldValue('');
  };
  const { t } = useTranslation();

  const handleUpdateChanges = () => {
    //logic for updating
  }
  const handleCreate = (value) => {
    if (value) {
      decks.push({ 'id': '4', name: value, count: 1, 'creator': '' });
      setTextFieldValue('');
      // add to backend
    }
  }

  return (
    <Box>
      <Box sx={rowContainerStyle}>
        <Typography variant="h5">This card is included in {placeholderDeck.length} decks</Typography>
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
              value={textFieldValue}
              margin="dense"
              onChange={handleTextFieldChange}
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
              handleCreate(textFieldValue);
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
            <Typography sx={{ marginRight: 2, marginLeft: 2 }} variant="subtitle1">
              My unreleased decks ({unreleasedDecks})
            </Typography>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={(e) => { e.stopPropagation(); handleUpdateChanges(); }}>
              {t('UPDATE_CHANGES')}
            </Button>
          </Box>
        </AccordionSummary>
        <Divider sx={{ borderColor: 'lightgrey' }} />
        <AccordionDetails>
          <List disablePadding>
            {decks.map(deck => (
              <ListItem disableGutters key={deck.id}>
                <IconButton sx={{ color: 'purple' }} onClick={() => handleDecrement(deck.name)}>
                  <RemoveIcon />
                </IconButton>
                <Box sx={{ width: '12px', textAlign: 'center' }}>
                  <Typography>{deck.count}</Typography>
                </Box>
                <IconButton sx={{ color: 'purple' }} onClick={() => handleIncrement(deck.name)}>
                  <AddIcon />
                </IconButton>
                <Typography>{deck.name}</Typography>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded sx={{ marginBottom: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography sx={{ marginRight: 2, marginLeft: 2 }} variant="subtitle1">
              Released decks ({releasedDecks})
            </Typography>
          </Box>
        </AccordionSummary>
        <Divider sx={{ borderColor: 'lightgrey' }} />
        <AccordionDetails>
          <List disablePadding>
            {decks.length > 0 && (
              <>
                <ListItem><Typography>My decks ({myDecks})</Typography></ListItem>
                {decks.map(deck => (
                  <ListItem key={deck.id}>
                    <Box sx={{ width: '40px', textAlign: 'center' }}>
                      <Typography sx={{ paddingRight: 2 }}>{deck.count}</Typography>
                    </Box>
                    <Typography>{deck.name}</Typography>
                  </ListItem>
                ))}
              </>
            )}
          </List>
        </AccordionDetails>
        <AccordionDetails>
          <List disablePadding>
            {decks.length > 0 && (
              <>
                <ListItem>
                  <Typography>
                    Other decks ({otherDecks})
                  </Typography>
                </ListItem>
                {decks.map(deck => (
                  <ListItem key={deck.id}>
                    <Box sx={{ width: '40px', textAlign: 'center' }}>
                      <Typography sx={{ paddingRight: 2 }}>{deck.count}</Typography>
                    </Box>
                    <Box sx={{ width: '100px', textAlign: 'center', marginRight: 4 }}>
                      <Typography sx={{ paddingRight: 5 }}>{deck.name}</Typography>
                    </Box>
                    <Box sx={{ width: '300px', textAlign: 'left' }}>
                      <Typography>Created by {deck.creator}</Typography>
                    </Box>
                  </ListItem>
                ))}
              </>
            )}
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default DeckTab;