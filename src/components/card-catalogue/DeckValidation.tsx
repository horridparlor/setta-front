import { useState, useEffect } from 'react';
import { CardData, CardSubtype, CardType } from '../../types/card';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useTranslation } from 'react-i18next';

const DeckValidation = (clickedCards: CardData[]) => {
  const [deckValidityState, setDeckValidityState] = useState<
    '' | 'validUnreleased' | 'notValid' | 'released'
  >('');
  const [invalidDueToAce, setInvalidDueToAce] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    const mainDeckCards = clickedCards.filter(
      card =>
        ![
          CardSubtype.FUSION,
          CardSubtype.REVENGE,
          CardSubtype.ROYAL,
          CardSubtype.TIME_TRAVELLER,
          CardSubtype.KILLER_MOVE,
        ].includes(card.subtype)
    );

    const extraDeckCards = clickedCards.filter(card =>
      [
        CardSubtype.FUSION,
        CardSubtype.REVENGE,
        CardSubtype.ROYAL,
        CardSubtype.TIME_TRAVELLER,
        CardSubtype.KILLER_MOVE,
      ].includes(card.subtype)
    );

    const totalMainDeckCount = mainDeckCards.reduce(
      (total, card) => total + card.count,
      0
    );
    const totalExtraDeckCount = extraDeckCards.reduce(
      (total, card) => total + card.count,
      0
    );

    const checkMainDeckValidity = mainDeckCards.some(card => {
      if (card.isAce) {
        const totalAceCountByType: Record<CardType, number> =
          mainDeckCards.reduce(
            (acc, c) => {
              if (c.isAce) {
                acc[c.cardType] = (acc[c.cardType] || 0) + c.count;
              }
              return acc;
            },
            {} as Record<CardType, number>
          );

        for (const type in totalAceCountByType) {
          if (totalAceCountByType[type as CardType] > 1) {
            return true;
          }
        }
      }

      return false;
    });

    const checkExtraDeckValidity = extraDeckCards.some(card => {
      if (card.isAce) {
        const totalAceCount = extraDeckCards
          .filter(c => c.isAce)
          .reduce((total, aceCard) => total + aceCard.count, 0);

        return totalAceCount > 1;
      }
      return false;
    });

    if (
      totalMainDeckCount !== 60 ||
      totalExtraDeckCount > 15 ||
      checkMainDeckValidity ||
      checkExtraDeckValidity
    ) {
      setDeckValidityState('notValid');
      setInvalidDueToAce(checkMainDeckValidity || checkExtraDeckValidity);
    } else {
      setDeckValidityState('validUnreleased');
      setInvalidDueToAce(false);
    }
  }, [clickedCards]);
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
