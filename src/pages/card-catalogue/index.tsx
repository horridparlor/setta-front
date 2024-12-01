import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { CardData, CardDeck, CardSubtype } from '../../types/card';
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

export type DeckData = {
  card: CardData;
  count: number;
  deckType: CardDeck;
};
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
  const [showClickedCards, setShowClickedCards] = useState(false);
  const toggleClickedCards = () => {
    setShowClickedCards(!showClickedCards);
  };
  const [deck, setDeck] = useState<DeckData[]>([]);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());

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
    setDeck(prevDeck => {
      const existingEntryIndex = prevDeck.findIndex(
        entry => entry.card.cardName === card.cardName
      );

      if (existingEntryIndex >= 0) {
        return updateExistingDeckEntry(prevDeck, existingEntryIndex, card);
      }
      return [...prevDeck, createNewDeckEntry(card)];
    });
  };
  const updateExistingDeckEntry = (
    deck: DeckData[],
    index: number,
    card: CardData
  ): DeckData[] => {
    const updatedDeck = [...deck];
    const existingEntry = updatedDeck[index];
    const newCount = card.isAce ? 1 : Math.min(3, existingEntry.count + 1);
    updatedDeck[index] = {
      ...existingEntry,
      count: newCount,
      deckType: existingEntry.deckType,
    };
    return updatedDeck;
  };
  const createNewDeckEntry = (card: CardData): DeckData => {
    const isExtraDeckCard = [
      CardSubtype.FUSION,
      CardSubtype.REVENGE,
      CardSubtype.ROYAL,
      CardSubtype.TIME_TRAVELLER,
      CardSubtype.KILLER_MOVE,
    ].includes(card.subtype);
    return {
      card,
      count: 1,
      deckType: isExtraDeckCard ? CardDeck.EXTRA : CardDeck.MAIN,
    };
  };

  const handleRemoveCard = (cardName: string) => {
    setDeck(prevDeck =>
      prevDeck.filter(entry => entry.card.cardName !== cardName)
    );
  };

  const clearDeck = (deckType: CardDeck) => {
    setDeck(prevDeck => {
      const updatedDeck = prevDeck.filter(entry => entry.deckType !== deckType);
      setSelectedCards(prevSelectedCards => {
        const updatedSelectedCards = new Set(prevSelectedCards);
        prevDeck.forEach(entry => {
          if (
            entry.deckType === deckType &&
            updatedSelectedCards.has(entry.card.cardName)
          ) {
            updatedSelectedCards.delete(entry.card.cardName);
          }
        });
        return updatedSelectedCards;
      });

      return updatedDeck;
    });
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
            cards={showClickedCards ? deck.map(entry => entry.card) : cards}
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
              deck={deck}
              onRemoveCard={handleRemoveCard}
              setDeck={setDeck}
              clearDeck={clearDeck}
              toggleClickedCards={toggleClickedCards}
              showClickedCards={showClickedCards}
              selectedCards={selectedCards}
              setSelectedCards={setSelectedCards}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CardCataloguePage;
