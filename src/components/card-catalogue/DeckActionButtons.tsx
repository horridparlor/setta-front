import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClearIcon from '@mui/icons-material/Clear';
import { useTranslation } from 'react-i18next';

export const DecrementButton: React.FC<{
  cardName: string;
  updateCardCount: (cardName: string, increment: boolean) => void;
}> = ({ cardName, updateCardCount }) => {
  const { t } = useTranslation();
  return (
    <Tooltip title={t('REMOVE_A_COPY')}>
      <IconButton size="small" onClick={() => updateCardCount(cardName, false)}>
        <RemoveIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export const IncrementButton: React.FC<{
  cardName: string;
  count: number | null;
  isAce: boolean;
  updateCardCount: (cardName: string, increment: boolean) => void;
}> = ({ cardName, count, isAce, updateCardCount }) => {
  const { t } = useTranslation();
  return (
    <Tooltip title={t('ADD_A_COPY')}>
      <IconButton
        size="small"
        onClick={() => updateCardCount(cardName, true)}
        disabled={count === 3 || isAce}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export const VisibilityButton: React.FC<{
  goToCardEditor: (cardId: number) => void;
  cardId: number;
}> = ({ goToCardEditor, cardId }) => {
  const { t } = useTranslation();
  return (
    <Tooltip title={t('SEE_IN_CARD_EDITOR')}>
      <IconButton size="small" onClick={() => goToCardEditor(cardId)}>
        <VisibilityIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export const RemoveButton: React.FC<{
  cardName: string;
  onRemoveCard: (cardName: string) => void;
  isCardSelected: (cardName: string) => boolean;
  handleCheckboxToggle: (cardName: string) => void;
}> = ({ cardName, onRemoveCard, isCardSelected, handleCheckboxToggle }) => {
  const { t } = useTranslation();
  return (
    <Tooltip title={t('REMOVE_CARD_FROM_DECK')}>
      <IconButton
        size="small"
        onClick={() => {
          if (isCardSelected(cardName)) {
            handleCheckboxToggle(cardName);
          }
          onRemoveCard(cardName);
        }}
      >
        <ClearIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};
