import { useState, useEffect } from 'react';
import { CardType, CardDeck } from '../../types/card';
import { DeckData } from '../../pages/card-catalogue';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useTranslation } from 'react-i18next';

const DeckValidation = (deck: DeckData[]) => {
  const [deckValidityState, setDeckValidityState] = useState<
    '' | 'validUnreleased' | 'notValid' | 'released'
  >('');
  const [invalidDueToAce, setInvalidDueToAce] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    const mainDeckCards = deck.filter(card => card.deckType === CardDeck.MAIN);
    const extraDeckCards = deck.filter(
      card => card.deckType === CardDeck.EXTRA
    );

    const totalCounts = {
      main: 0,
      extra: 0,
      aceMainDeck: {} as Record<CardType, number>,
      aceExtraDeck: 0,
    };
    mainDeckCards.forEach(deckEntry => {
      totalCounts.main += deckEntry.count;
      if (deckEntry.card.isAce) {
        totalCounts.aceMainDeck[deckEntry.card.cardType] =
          (totalCounts.aceMainDeck[deckEntry.card.cardType] || 0) +
          deckEntry.count;
      }
    });
    extraDeckCards.forEach(deckEntry => {
      totalCounts.extra += deckEntry.count;
      if (deckEntry.card.isAce) {
        totalCounts.aceExtraDeck += deckEntry.count;
      }
    });

    const checkMainDeckValidity = Object.values(totalCounts.aceMainDeck).some(
      count => count > 1
    );
    const checkExtraDeckValidity = totalCounts.aceExtraDeck > 1;
    if (
      totalCounts.main !== 50 ||
      totalCounts.extra > 8 ||
      checkMainDeckValidity ||
      checkExtraDeckValidity
    ) {
      setDeckValidityState('notValid');
      setInvalidDueToAce(checkMainDeckValidity || checkExtraDeckValidity);
    } else {
      setDeckValidityState('validUnreleased');
      setInvalidDueToAce(false);
    }
  }, [deck]);
  const getDeckStateMessage = () => {
    switch (deckValidityState) {
      case 'validUnreleased':
        return {
          text: t('THIS_DECK_IS_VALID_AND_CAN_BE_RELEASED'),
          color: 'green',
          icon: (
            <CheckCircleOutlineIcon sx={{ color: 'green', marginRight: 1 }} />
          ),
          backgroundColor: '#e6f4e6',
        };
      case 'released':
        return {
          text: t(
            'THIS_DECK_HAS_BEEN_RELEASED_ON_MM/DD/YYYY_AND_MUST_BE_UNRELEASED_BEFORE_MAKING_CHANGES'
          ),
          color: 'purple',
          icon: <CheckCircleIcon sx={{ color: 'purple', marginRight: 1 }} />,
          backgroundColor: '#f0e6f4',
        };
      case 'notValid':
        return {
          text: t('THIS_DECK_IS_NOT_VALID'),
          color: 'red',
          icon: <ErrorIcon sx={{ color: 'red', marginRight: 1 }} />,
          backgroundColor: '#f8e6e6',
        };
      default:
        return { text: '', color: 'black', icon: null };
    }
  };

  const { text, color, icon, backgroundColor } = getDeckStateMessage();

  return {
    deckValidityState,
    invalidDueToAce,
    deckStateMessage: { text, color, icon, backgroundColor },
  };
};

export default DeckValidation;
