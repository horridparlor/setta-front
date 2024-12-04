import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Box, Card } from '@mui/material';
import {
  CardData,
  CardType,
  getCardsExpansion,
  getCardsExpansionIds,
  getCombinedStats,
  getFullTypeString,
  isExtraDeckCard,
  isGroupCardType,
  isIncludedInGroupCardType,
  isMonster,
  isOfCardDeck,
} from '../../types/card';
import CardFilters, { CardFiltersRef } from './CardFilters';
import CardPreviewer from '../card-editor/card-previewer/CardPreviewer';
import { CardExpansion } from '../../types/expansion';
import { isNoneString, normalizeName } from '../../utils/string';
import { ComparisonType, SortOption, SortOrder } from '../../types/filter';
import { CardOwner } from '../../types/user';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import { MultitaskCookie } from '../../types/cookie';
import Cookies from 'js-cookie';

interface CardCatalogueProps {
  handleCardClick: (cardData: CardData) => void;
  cards: Array<CardData>;
  cardOwners: Array<CardOwner>;
  expansions: Array<CardExpansion>;
  visibleCardCount: number;
  setVisibleCardCount: (newCount: number) => void;
  defaultCardsShown: number;
  onToggleDeckBuilder: () => void;
  showDeckBuilder: boolean;
  handleRemoveCard: (cardName: string) => void;
}

export interface CardCatalogueRef {
  resetFilters: () => void;
  backdownFilters: () => void;
  toggleFilters: () => void;
}

const CardCatalogue = forwardRef<CardCatalogueRef, CardCatalogueProps>(
  (
    {
      handleCardClick,
      cards,
      cardOwners,
      expansions,
      visibleCardCount,
      setVisibleCardCount,
      defaultCardsShown,
      onToggleDeckBuilder,
      showDeckBuilder,
      handleRemoveCard,
    },
    ref
  ) => {
    const [filters, setFilters] = useState({
      cardName: '',
      cardEffects: '',
      referenceId: '',
      cardType: '',
      cardSubtype: '',
      cardSupertype: '',
      cardClass: '',
      cardDeck: '',
      expansionId: '',
      sortOrder: '',
      sortBy: '',
      level: 1,
      levelOperation: '',
      atk: 0,
      atkOperation: '',
      def: 0,
      defOperation: '',
      isAce: false,
      ownerId: '',
      isReleased: false,
      isErrata: false,
    });

    const SHOW_MORE_CARDS = 42;
    const cardScale = 0.55;
    const filtersRef = useRef<CardFiltersRef>(null);

    const onGetReferences = (cardData: CardData) => {
      filtersRef.current?.referenceCard(cardData);
    };

    const getAllCardIdsReferencedInCard = (card: CardData) => {
      return [
        card.cardId,
        card.errataOfId,
        card.primaryMaterialId,
        card.secondaryMaterialId,
        card.tertiaryMaterialId,
        card.countsAsId,
      ];
    };

    const isReferenceToCard = (card: CardData, referenceId: number) => {
      const referenceCard: CardData | undefined = cards.find(
        card => card.cardId === referenceId
      );
      if (!referenceCard) {
        return false;
      }
      const references = getAllCardIdsReferencedInCard(referenceCard);
      return getAllCardIdsReferencedInCard(card)
        .filter(id => id)
        .some(id => references.includes(id));
    };

    const isInReferenceMode = () => {
      return filters.referenceId !== '';
    };

    const checkStat = (
      stat: number,
      comparedStat: number,
      operation: string
    ) => {
      switch (operation) {
        case ComparisonType.MORE:
          return stat >= comparedStat;
        case ComparisonType.EQUAL:
          return stat === comparedStat;
        case ComparisonType.LESS:
          return stat <= comparedStat;
      }
    };

    const checkLevel = (cardData: CardData) => {
      return checkStat(cardData.level, filters.level, filters.levelOperation);
    };

    const checkAtk = (cardData: CardData) => {
      return checkStat(cardData.atk, filters.atk, filters.atkOperation);
    };

    const checkDef = (cardData: CardData) => {
      return checkStat(cardData.def, filters.def, filters.defOperation);
    };

    const isNewestReleased = (cardData: CardData) => {
      if (!cardData.errataOfId) {
        return true;
      }
      return (
        cardData.cardId ===
        Math.max(
          ...cards
            .filter(
              card =>
                card.errataOfId === cardData.errataOfId &&
                getCardsExpansion(card, expansions)?.isReleased
            )
            .map(card => card.cardId)
        )
      );
    };

    const filteredCards = cards.filter(
      card =>
        (isInReferenceMode() ||
          normalizeName(card)
            .toLowerCase()
            .includes(normalizeName(filters.cardName).toLowerCase())) &&
        filters.cardEffects
          .toLowerCase()
          .split(' ')
          .every(
            word =>
              isInReferenceMode() ||
              (card.costText + card.effectText).toLowerCase().includes(word)
          ) &&
        (!isInReferenceMode() ||
          isReferenceToCard(card, parseInt(filters.referenceId))) &&
        (isInReferenceMode() ||
          isNoneString(filters.cardType) ||
          (isGroupCardType(filters.cardType)
            ? isIncludedInGroupCardType(card.cardType, filters.cardType)
            : card.cardType === filters.cardType)) &&
        (isInReferenceMode() ||
          filters.cardSubtype === '' ||
          card.subtype === filters.cardSubtype) &&
        (isInReferenceMode() ||
          filters.cardSupertype === '' ||
          card.supertype === filters.cardSupertype) &&
        (isInReferenceMode() ||
          filters.cardClass === '' ||
          (card.cardType === CardType.MONSTER &&
            card.cardClass === filters.cardClass)) &&
        (isInReferenceMode() ||
          isNoneString(filters.cardDeck) ||
          isOfCardDeck(card, filters.cardDeck)) &&
        (isInReferenceMode() ||
          filters.expansionId === '' ||
          getCardsExpansionIds(card).has(parseInt(filters.expansionId))) &&
        ((![
          SortOption.CARD_CLASS,
          SortOption.LEVEL,
          SortOption.ATK,
          SortOption.DEF,
          SortOption.COMBINED,
        ].includes(filters.sortBy as SortOption) &&
          filters.levelOperation === '' &&
          filters.atkOperation === '' &&
          filters.defOperation === '') ||
          isMonster(card)) &&
        (isInReferenceMode() ||
          filters.levelOperation === '' ||
          checkLevel(card)) &&
        (isInReferenceMode() ||
          filters.atkOperation === '' ||
          checkAtk(card)) &&
        (isInReferenceMode() ||
          filters.defOperation === '' ||
          checkDef(card)) &&
        (isInReferenceMode() || !filters.isAce || card.isAce) &&
        (isInReferenceMode() ||
          filters.ownerId === '' ||
          card.ownerId === parseInt(filters.ownerId)) &&
        (isInReferenceMode() ||
          !filters.isReleased ||
          ((getCardsExpansion(card, expansions)?.id ===
            parseInt(filters.expansionId) ||
            getCardsExpansion(card, expansions)?.isReleased) &&
            isNewestReleased(card))) &&
        (isInReferenceMode() ||
          !filters.isErrata ||
          (card.errataOfId && card.errataOfId !== card.cardId))
    );
    const doSortAscending = () => {
      return filters.sortOrder !== SortOrder.DESCENDING;
    };
    const shuffleArray = (source: Array<any>) => {
      for (let i = source.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [source[i], source[j]] = [source[j], source[i]];
      }
    };
    const getSortedCards = () => {
      switch (filters.sortBy as SortOption) {
        case SortOption.LEVEL:
          return filteredCards.sort((cardA, cardB) =>
            doSortAscending()
              ? cardA.level - cardB.level
              : cardB.level - cardA.level
          );
        case SortOption.ATK:
          return filteredCards.sort((cardA, cardB) =>
            doSortAscending() ? cardA.atk - cardB.atk : cardB.atk - cardA.atk
          );
        case SortOption.DEF:
          return filteredCards.sort((cardA, cardB) =>
            doSortAscending() ? cardA.def - cardB.def : cardB.def - cardA.def
          );
        case SortOption.COMBINED:
          return filteredCards.sort((cardA, cardB) =>
            doSortAscending()
              ? getCombinedStats(cardA) - getCombinedStats(cardB)
              : getCombinedStats(cardB) - getCombinedStats(cardA)
          );
        case SortOption.CARD_CLASS:
          return filteredCards.sort((cardA, cardB) =>
            doSortAscending()
              ? cardA.cardClass.localeCompare(cardB.cardClass)
              : cardB.cardClass.localeCompare(cardA.cardClass)
          );
        case SortOption.CARD_TYPE:
          return filteredCards.sort((cardA, cardB) =>
            doSortAscending()
              ? getFullTypeString(cardA).localeCompare(getFullTypeString(cardB))
              : getFullTypeString(cardB).localeCompare(getFullTypeString(cardA))
          );
        case SortOption.OWNER:
          return filteredCards.sort((cardA, cardB) =>
            doSortAscending()
              ? cardA.ownerId - cardB.ownerId
              : cardB.ownerId - cardA.ownerId
          );
        case SortOption.EXPANSION:
          return filteredCards.sort((cardA, cardB) =>
            doSortAscending()
              ? cardA.expansionId - cardB.expansionId
              : cardB.expansionId - cardA.expansionId
          );
        case SortOption.RANDOM:
          shuffleArray(filteredCards);
          return filteredCards;
        case SortOption.CREATED_AT:
          return filteredCards.sort((cardA, cardB) =>
            !doSortAscending()
              ? cardA.createdAt.localeCompare(cardB.createdAt)
              : cardB.createdAt.localeCompare(cardA.createdAt)
          );
        case SortOption.NAME:
          return filteredCards.sort((cardA, cardB) =>
            doSortAscending()
              ? normalizeName(cardA).localeCompare(normalizeName(cardB))
              : -normalizeName(cardA).localeCompare(normalizeName(cardB))
          );
        case SortOption.UPDATED_AT:
        default:
          return filteredCards.sort((cardA, cardB) =>
            !doSortAscending()
              ? cardA.updatedAt.localeCompare(cardB.updatedAt)
              : cardB.updatedAt.localeCompare(cardA.updatedAt)
          );
      }
    };

    const resetCardsShown = () => {
      setVisibleCardCount(defaultCardsShown);
    };
    const resetFilters = () => {
      filtersRef.current?.resetFilters();
      resetCardsShown();
    };
    const backdownFilters = () => {
      if (isInReferenceMode()) {
        filtersRef.current?.clearReference();
      }
    };
    const toggleFilters = () => {
      filtersRef.current?.toggleFilters();
    };

    useImperativeHandle(ref, () => ({
      resetFilters,
      backdownFilters,
      toggleFilters,
    }));

    const onExportAll = () => {
      const cardIds = filteredCards.map(card => card.cardId);
      if (!cardIds.length) {
        return;
      }
      Cookies.set(MultitaskCookie.EXPORTING_ALL_INDEX, JSON.stringify(0));
      Cookies.set(MultitaskCookie.EXPORTING_ALL_CARDS, JSON.stringify(cardIds));
      handleCardClick(filteredCards[0]);
    };

    const countOfFilteredMain = filteredCards.filter(
      card => !isExtraDeckCard(card) && !card.isAce
    ).length;
    const countOfFilteredMainAce = filteredCards.filter(
      card => !isExtraDeckCard(card) && card.isAce
    ).length;
    const countOfFilteredExtra = filteredCards.filter(card =>
      isExtraDeckCard(card)
    ).length;
    const cardsNeededToPrintForTwoPlayers =
      6 * countOfFilteredMain +
      2 * (countOfFilteredMainAce + countOfFilteredExtra);
    const resultCountString = `${countOfFilteredMain}${countOfFilteredMainAce ? ` + ${countOfFilteredMainAce}` : ''} + ${countOfFilteredExtra} = ${cardsNeededToPrintForTwoPlayers}${
      cardsNeededToPrintForTwoPlayers <= 234 &&
      cardsNeededToPrintForTwoPlayers % 18 === 0
        ? ' ✔️'
        : ''
    }`;

    return (
      <Box
        sx={{
          padding: 2,
        }}
      >
        <CardFilters
          ref={filtersRef}
          cards={cards}
          cardOwners={cardOwners}
          expansions={expansions}
          onFilterChange={setFilters}
          isShowingMoreCards={visibleCardCount > defaultCardsShown}
          resetCardsShown={resetCardsShown}
          resultCountString={resultCountString}
          resultsCount={filteredCards.length}
          handleExportAll={onExportAll}
          onToggleDeckBuilder={onToggleDeckBuilder}
          showDeckBuilder={showDeckBuilder}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            overflowX: 'auto',
            flexWrap: 'wrap',
            justifyContent: 'center',
            overflowY: 'auto',
            height: '100vh',
            marginTop: '16rem',
          }}
        >
          {getSortedCards()
            .slice(0, visibleCardCount)
            .map((cardData, index) => (
              <Card
                key={index}
                onClick={() => handleCardClick(cardData)}
                onDoubleClick={() => handleRemoveCard(cardData.cardName)}
                onContextMenu={event => {
                  event.preventDefault();
                  onGetReferences(cardData);
                }}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  borderRadius: `${1.5 * cardScale}rem`,
                  minWidth: `${30 * cardScale}rem`,
                }}
                elevation={0}
              >
                <CardPreviewer
                  cards={cards}
                  expansions={expansions}
                  cardData={cardData}
                  scale={cardScale}
                />
              </Card>
            ))}
        </Box>
        <Box
          sx={{
            textAlign: 'center',
            padding: 2,
            display:
              getSortedCards().length > visibleCardCount ? 'flex' : 'none',
            justifyContent: 'center',
          }}
        >
          {visibleCardCount < cards.length && (
            <Button
              variant="contained"
              onClick={() => {
                setVisibleCardCount(visibleCardCount + SHOW_MORE_CARDS);
                toast.success('Great, scroll down for more cards');
              }}
            >
              Load More
            </Button>
          )}
        </Box>
      </Box>
    );
  }
);

export default CardCatalogue;
