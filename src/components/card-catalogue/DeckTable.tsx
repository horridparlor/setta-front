import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Box,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CardData, CardSubtype, CardType } from '../../types/card';
import {
  DecrementButton,
  IncrementButton,
  VisibilityButton,
  RemoveButton,
} from './DeckActionButtons';
import DeckValidation from './DeckValidation';
import { useTranslation } from 'react-i18next';
import { DeckData } from '../../pages/card-catalogue';
import { useNavigate } from 'react-router-dom';
import { AppPage } from '../../types/navigation';

interface DeckTableProps {
  cards: DeckData[];
  groupBy: keyof CardData;
  getGroupLabel: (group: string) => string;
  isCardSelected: (cardName: string) => boolean;
  handleCheckboxToggle: (cardName: string) => () => void;
  updateCardCount: (cardName: string, increment: boolean) => void;
  onRemoveCard: (cardName: string) => void;
}

const DeckTable: React.FC<DeckTableProps> = ({
  cards,
  groupBy,
  getGroupLabel,
  isCardSelected,
  handleCheckboxToggle,
  updateCardCount,
  onRemoveCard,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { invalidDueToAce } = DeckValidation(cards);
  const [anchorElMore, setAnchorElMore] = React.useState<null | HTMLElement>(
    null
  );
  const openMore = Boolean(anchorElMore);
  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElMore(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorElMore(null);
  };

  const getCardColor = (type: CardType, subtype: CardSubtype) => {
    let color = '';
    switch (type) {
      case CardType.SPELL:
        color = 'green';
        break;
      case CardType.TRAP:
        color = 'pink';
        break;
      case CardType.MONSTER:
        switch (subtype) {
          case CardSubtype.EFFECT:
            color = 'orange';
            break;
          case CardSubtype.FUSION:
            color = 'purple';
            break;
          case CardSubtype.REVENGE:
            color = 'red';
            break;
          case CardSubtype.ROYAL:
            color = 'black';
            break;
          case CardSubtype.TIME_TRAVELLER:
            color = 'darkblue';
            break;
          case CardSubtype.KILLER_MOVE:
            color = 'lightblue';
            break;
          default:
            color = 'yellow';
        }
        break;
      default:
        color = 'gray';
    }
    return color;
  };
  const goToCardEditor = (cardId: number) => {
    const cardRoute = `${AppPage.CardEditor}/${cardId.toString()}`;
    navigate(cardRoute);
  };
  const cardsByGroup = cards.reduce(
    (acc, deckEntry) => {
      const groupKey = String(deckEntry.card[groupBy]);
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(deckEntry);
      return acc;
    },
    {} as Record<string, DeckData[]>
  );

  return (
    <Table>
      <TableBody>
        {Object.entries(cardsByGroup).map(([group, groupedCards]) => (
          <React.Fragment key={group}>
            <TableRow>
              <TableCell sx={{ padding: '2px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {getGroupLabel(group)} (
                  {groupedCards.reduce(
                    (totalCount, card) => totalCount + card.count,
                    0
                  )}
                  )
                </Typography>
              </TableCell>
            </TableRow>

            {groupedCards.map((deckEntry, index) => {
              const { card, count } = deckEntry;
              const color = getCardColor(card.cardType, card.subtype);
              return (
                <TableRow key={`${group}-${index}`}>
                  <TableCell sx={{ padding: '0px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        checked={isCardSelected(card.cardName)}
                        onChange={handleCheckboxToggle(card.cardName)}
                        sx={{ padding: '0px' }}
                      />
                      <Box
                        sx={{
                          width: 5,
                          height: 20,
                          backgroundColor: color,
                          marginRight: 1,
                          marginLeft: 1,
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DecrementButton
                          cardName={card.cardName}
                          updateCardCount={updateCardCount}
                        />
                        <Typography variant="body2" sx={{ margin: '0 4px' }}>
                          {count}
                        </Typography>
                        <IncrementButton
                          cardName={card.cardName}
                          count={count}
                          isAce={card.isAce}
                          updateCardCount={updateCardCount}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ margin: '0 4px' }}>
                        {card.cardName}
                      </Typography>
                      {card.isAce ? (
                        <Box
                          sx={{
                            ml: 1,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: invalidDueToAce ? 'red' : 'green',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                          }}
                        >
                          ACE
                        </Box>
                      ) : null}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ padding: '2px' }}>
                    <VisibilityButton
                      goToCardEditor={goToCardEditor}
                      cardId={deckEntry.card.cardId}
                    />
                    <IconButton size="small" onClick={handleMoreClick}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                    <Menu
                      anchorEl={anchorElMore}
                      open={openMore}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleMenuClose}>
                        {t('MOVE_CARD_TO_SIDE_DECK')}
                      </MenuItem>
                      <MenuItem onClick={handleMenuClose}>
                        {t('MOVE_ALL_SELECTED_CARDS_TO_SIDE_DECK')}
                      </MenuItem>
                    </Menu>
                    <RemoveButton
                      cardName={card.cardName}
                      onRemoveCard={onRemoveCard}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default DeckTable;
