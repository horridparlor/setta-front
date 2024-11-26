import React, { useState, useEffect } from 'react';
import { CardDeck } from '../../types/card';
import DeckValidation from './DeckValidation';
import DeckTable from './DeckTable';
import DeckBuilderManagement from './DeckBuilderManagement';
import {
  Card,
  CardActions,
  CardContent,
  Box,
  IconButton,
  SelectChangeEvent,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Collapse,
} from '@mui/material';
import Button, { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useTranslation } from 'react-i18next';
import { DeckData } from '../../pages/card-catalogue';

interface DeckBuilderProps {
  onClose: () => void;
  deck: DeckData[];
  onRemoveCard: (cardName: string) => void;
  clearDeck: (deckType: CardDeck) => void;
  toggleClickedCards: () => void;
  showClickedCards: boolean;
  setDeck: React.Dispatch<React.SetStateAction<DeckData[]>>;
}

const DeckBuilder: React.FC<DeckBuilderProps> = ({
  onClose,
  deck,
  onRemoveCard,
  clearDeck,
  toggleClickedCards,
  showClickedCards,
  setDeck,
}) => {
  const [openExitDialog, setOpenExitDialog] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [deckNameText, setDeckNameText] = useState('');
  const [mainDeckOpen, setMainDeckOpen] = useState(false);
  const [extraDeckOpen, setExtraDeckOpen] = useState(false);
  const [sideDeckOpen, setSideDeckOpen] = useState(false);
  const { deckValidityState } = DeckValidation(deck);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const { t } = useTranslation();
  const [userToggled, setUserToggled] = useState(false);

  const extraDeckCount = deck
    .filter(deckEntry => deckEntry.deckType === CardDeck.EXTRA)
    .reduce((total, deckEntry) => total + deckEntry.count, 0);
  const mainDeckCount = deck
    .filter(deckEntry => deckEntry.deckType === CardDeck.MAIN)
    .reduce((total, deckEntry) => total + deckEntry.count, 0);
  const sideDeckCount = deck
    .filter(deckEntry => deckEntry.deckType === CardDeck.SIDE)
    .reduce((total, deckEntry) => total + deckEntry.count, 0);
  useEffect(() => {
    if (mainDeckCount > 0 && !userToggled) {
      setMainDeckOpen(true);
    }
    if (extraDeckCount > 0 && !userToggled) {
      setExtraDeckOpen(true);
    }
    if (sideDeckCount > 0 && !userToggled) {
      setSideDeckOpen(true);
    }
  }, [mainDeckCount, userToggled, extraDeckCount, sideDeckCount]);

  const handleToggle = () => {
    setMainDeckOpen(!mainDeckOpen);
    setExtraDeckOpen(!extraDeckOpen);
    setSideDeckOpen(!sideDeckOpen);
    setUserToggled(true);
  };

  const ExitDeckButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
  }));

  const saveDeck = () => {
    const deckToSave = {
      deckNameText,
      deck,
    };
    console.log(deckToSave);
  };
  const handleCopyDeck = () => {
    saveDeck();
    setDeckNameText(`${deckNameText}(2)`);
  };
  const handleDeckChange = (e: SelectChangeEvent) => {
    const selectedDeck = e.target.value;
    setDeckName(selectedDeck);
    setDeckNameText(selectedDeck);
  };

  const handleExitDeckBuilder = () => {
    if (deckValidityState != 'released') {
      setOpenExitDialog(true);
    } else {
      if (showClickedCards) {
        toggleClickedCards();
      }
      clearDeckbuilder();
      onClose();
    }
  };
  const handleConfirmExit = () => {
    setOpenExitDialog(false);
    if (showClickedCards) {
      toggleClickedCards();
    }
    clearDeckbuilder();
    onClose();
  };

  const isCardSelected = (cardName: string) => selectedCards.has(cardName);
  const handleCheckboxChange = (cardName: string) => {
    setSelectedCards(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(cardName)) {
        newSelected.delete(cardName);
      } else {
        newSelected.add(cardName);
      }
      return newSelected;
    });
  };

  const handleCheckboxToggle = (cardName: string) => () => {
    handleCheckboxChange(cardName);
  };
  const clearDeckbuilder = () => {
    setDeckName('');
    setDeckNameText('');
    clearDeck(CardDeck.MAIN);
    clearDeck(CardDeck.EXTRA);
    clearDeck(CardDeck.SIDE);
  };

  const updateCardCount = (cardName: string, increment: boolean) => {
    setDeck(prevCards => {
      const isBulkUpdate = selectedCards.size > 0;
      const updatedDeck = prevCards.map(deckEntry => {
        const card = deckEntry.card;
        if (isBulkUpdate) {
          if (selectedCards.has(card.cardName)) {
            const maxCount = card.isAce ? 1 : 3;
            const newCount = Math.max(
              0,
              Math.min(maxCount, deckEntry.count + (increment ? 1 : -1))
            );
            if (newCount <= 0) {
              handleCheckboxChange(card.cardName);
              return null;
            }
            return { ...deckEntry, count: newCount };
          }
          return deckEntry;
        }
        if (card.cardName === cardName) {
          const newCount = Math.max(
            0,
            Math.min(3, deckEntry.count + (increment ? 1 : -1))
          );
          if (newCount <= 0) {
            return null;
          }
          return { ...deckEntry, count: newCount };
        }
        return deckEntry;
      });
      return updatedDeck.filter(deckEntry => deckEntry !== null);
    });
  };

  return (
    <Card sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CardActions>
        <Button
          onClick={toggleClickedCards}
          variant="outlined"
          sx={{ whiteSpace: 'nowrap' }}
        >
          <KeyboardArrowLeftIcon />
          {showClickedCards
            ? t('SHOW_ALL_CARDS')
            : t('VIEW_CARDS_IN_CURRENT_DECK')}
        </Button>
        <ExitDeckButton
          onClick={handleExitDeckBuilder}
          variant="contained"
          sx={{ whiteSpace: 'nowrap' }}
        >
          {t('EXIT_DECK_BUILDER')}
        </ExitDeckButton>
        <Dialog open={openExitDialog} onClose={() => setOpenExitDialog(false)}>
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
              <DialogContentText>
                {t('YOUR_DECK_HAS_UNSAVED_CHANGES')}
              </DialogContentText>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleConfirmExit} color="error">
              {t('CLOSE_WITHOUT_SAVING')}
            </Button>
            <Button onClick={() => setOpenExitDialog(false)} color="primary">
              {t('CANCEL')}
            </Button>
            <Button
              onClick={() => {
                saveDeck();
                handleConfirmExit();
              }}
              variant="contained"
              color="primary"
              disabled={deckNameText === ''}
            >
              {t('SAVE')}
            </Button>
          </DialogActions>
        </Dialog>
      </CardActions>
      <DeckBuilderManagement
        deck={deck}
        deckName={deckName}
        handleDeckChange={handleDeckChange}
        clearDeckbuilder={clearDeckbuilder}
        handleCopyDeck={handleCopyDeck}
        deckNameText={deckNameText}
        setDeckNameText={setDeckNameText}
        saveDeck={saveDeck}
        deckValidityState={deckValidityState}
      />
      <CardContent sx={{ mt: 0, flex: 1, overflowY: 'auto' }}>
        <IconButton onClick={handleToggle} size="small">
          {mainDeckOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          {t('MAIN_DECK')} ({mainDeckCount})
        </IconButton>
        <IconButton onClick={() => clearDeck(CardDeck.MAIN)} size="small">
          <DeleteIcon />
        </IconButton>
        <Collapse in={mainDeckOpen}>
          <DeckTable
            cards={deck.filter(card => card.deckType === CardDeck.MAIN)}
            groupBy="cardType"
            getGroupLabel={group => `${group}`}
            isCardSelected={isCardSelected}
            handleCheckboxToggle={handleCheckboxToggle}
            updateCardCount={updateCardCount}
            onRemoveCard={onRemoveCard}
          />
        </Collapse>

        <IconButton
          onClick={() => setExtraDeckOpen(!extraDeckOpen)}
          size="small"
        >
          {extraDeckOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          {t('EXTRA_DECK')} ({extraDeckCount})
        </IconButton>
        <IconButton onClick={() => clearDeck(CardDeck.EXTRA)} size="small">
          <DeleteIcon />
        </IconButton>
        <Collapse in={extraDeckOpen}>
          <DeckTable
            cards={deck.filter(card => card.deckType === CardDeck.EXTRA)}
            groupBy="subtype"
            getGroupLabel={group => `${group}`}
            isCardSelected={isCardSelected}
            handleCheckboxToggle={handleCheckboxToggle}
            updateCardCount={updateCardCount}
            onRemoveCard={onRemoveCard}
          />
        </Collapse>

        <IconButton onClick={() => setSideDeckOpen(!sideDeckOpen)} size="small">
          {sideDeckOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          {t('SIDE_DECK')} ({sideDeckCount})
        </IconButton>
        <Collapse in={sideDeckOpen}>
          <DeckTable
            cards={deck.filter(card => card.deckType === CardDeck.SIDE)}
            groupBy="cardType"
            getGroupLabel={group => `${group}`}
            isCardSelected={isCardSelected}
            handleCheckboxToggle={handleCheckboxToggle}
            updateCardCount={updateCardCount}
            onRemoveCard={onRemoveCard}
          />
        </Collapse>
      </CardContent>
    </Card>
  );
};
export default DeckBuilder;
