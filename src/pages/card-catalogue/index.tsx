import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { CardData, CardDeck } from '../../types/card';
import { CardOwner } from '../../types/user';
import { CardExpansion } from '../../types/expansion';
import HomeBar, { HomeBarRef } from '../../components/common/HomeBar';
import CardCatalogue, {
  CardCatalogueRef,
} from '../../components/card-catalogue/CardCatalogue';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppPage } from '../../types/navigation';
import { PageCookie } from '../../types/cookie';
import DeckBuilder from '../../components/card-catalogue/DeckBuilder';

interface CardCataloguePageProps {
  cards: Array<CardData>;
  cardOwners: Array<CardOwner>;
  expansions: Array<CardExpansion>;
  refetch: () => Promise<void>;
}

const CardCataloguePage = (props: CardCataloguePageProps) => {
  const DEFAULT_CARDS_SHOWN = 24;
  const initialCardsShown = parseInt(
    sessionStorage.getItem(PageCookie.CARD_CATALOGUE_CARDS_SHOWN) ||
      DEFAULT_CARDS_SHOWN.toString()
  );
  const [visibleCardCount, setVisibleCardCount] = useState(initialCardsShown);

  const { cards, cardOwners, expansions, refetch } = props;
  const catalogueRef = useRef<CardCatalogueRef>(null);
  const homeBarRef = useRef<HomeBarRef>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [showDeckBuilder, setShowDeckBuilder] = useState<boolean>(false);
  const [clickedCards, setClickedCards] = useState<CardData[]>([]);
  const [showClickedCards, setShowClickedCards] = useState(false);
  const toggleClickedCards = () => {
    setShowClickedCards(!showClickedCards);
  };

  const commitSave = () => {
    catalogueRef.current?.toggleFilters();
  };
  const commitReset = () => {
    catalogueRef.current?.resetFilters();
  };
  const commitEscape = () => {
    catalogueRef.current?.backdownFilters();
  };
  const onLeavePage = () => {
    const params = new URLSearchParams(location.search);
    sessionStorage.setItem(
      PageCookie.CARD_CATALOGUE_CARDS_SHOWN,
      visibleCardCount.toString()
    );
    sessionStorage.setItem(
      PageCookie.CARD_CATALOGUE_FILTERS,
      params.toString()
    );
  };

  const handleCardClick = (card: CardData) => {
    if (!showDeckBuilder) {
      onLeavePage();
      const cardRoute = `${AppPage.CardEditor}/${card.cardId.toString()}`;
      navigate(cardRoute);
      return;
    }
    setClickedCards(prevCards => {
      const existingCardIndex = prevCards.findIndex(
        c => c.cardName === card.cardName
      );
      if (existingCardIndex >= 0) {
        const updatedCards = [...prevCards];
        const existingCard = updatedCards[existingCardIndex];
        if (existingCard.isAce) {
          existingCard.count = 1;
        } else {
          existingCard.count = Math.min(3, existingCard.count + 1);
        }
        updatedCards[existingCardIndex] = existingCard;
        return updatedCards;
      } else {
        return [...prevCards, { ...card, count: 1 }];
      }
    });
  };

  const handleRemoveCard = (cardName: string) => {
    setClickedCards(prevCards =>
      prevCards.filter(card => card.cardName !== cardName)
    );
  };

  const clearDeck = (deckType: CardDeck) => {
    setClickedCards(prevCards =>
      prevCards.filter(card => {
        const isExtraDeckCard = [
          'Fusion',
          'Revenge',
          'Royal',
          'Time Traveller',
          'Killer Move',
        ].includes(card.subtype);

        if (deckType === CardDeck.MAIN) return isExtraDeckCard;
        if (deckType === CardDeck.EXTRA) return !isExtraDeckCard;
        return false;
      })
    );
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        switch (event.key) {
          case 's':
            event.preventDefault();
            commitSave();
            break;
          case 'l':
            event.preventDefault();
            homeBarRef.current?.toggleLoginOpen();
            break;
          case 'r':
            event.preventDefault();
            commitReset();
            break;
        }
      } else if (event.key === 'Escape') {
        commitEscape();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  const toggleDeckBuilder = () => {
    setShowDeckBuilder(prev => !prev);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#244775',
        overflowX: 'hidden',
      }}
    >
      <Box sx={{ width: '100%' }}>
        <HomeBar refetch={refetch} ref={homeBarRef} onLeavePage={onLeavePage} />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            flex: showDeckBuilder ? 2 : 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'auto',
          }}
        >
          <CardCatalogue
            cards={showClickedCards ? clickedCards : cards}
            cardOwners={cardOwners}
            expansions={expansions}
            ref={catalogueRef}
            handleCardClick={handleCardClick}
            visibleCardCount={visibleCardCount}
            setVisibleCardCount={setVisibleCardCount}
            defaultCardsShown={DEFAULT_CARDS_SHOWN}
            onToggleDeckBuilder={toggleDeckBuilder}
            showDeckBuilder={showDeckBuilder}
            handleRemoveCard={handleRemoveCard}
          />
        </Box>
        {showDeckBuilder && (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              p: 2,
              overflow: 'auto',
              backgroundColor: 'white',
            }}
          >
            <DeckBuilder
              onClose={toggleDeckBuilder}
              clickedCards={clickedCards}
              onRemoveCard={handleRemoveCard}
              setClickedCards={setClickedCards}
              clearDeck={clearDeck}
              toggleClickedCards={toggleClickedCards}
              showClickedCards={showClickedCards}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CardCataloguePage;
