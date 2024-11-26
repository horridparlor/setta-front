import React from 'react';
import { IconButton } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClearIcon from '@mui/icons-material/Clear';

export const DecrementButton: React.FC<{
  cardName: string;
  updateCardCount: (cardName: string, increment: boolean) => void;
}> = ({ cardName, updateCardCount }) => (
  <IconButton size="small" onClick={() => updateCardCount(cardName, false)}>
    <RemoveIcon fontSize="small" />
  </IconButton>
);

export const IncrementButton: React.FC<{
  cardName: string;
  count: number | null;
  isAce: boolean;
  updateCardCount: (cardName: string, increment: boolean) => void;
}> = ({ cardName, count, isAce, updateCardCount }) => (
  <IconButton
    size="small"
    onClick={() => updateCardCount(cardName, true)}
    disabled={!!(count === 3 || isAce)}
  >
    <AddIcon fontSize="small" />
  </IconButton>
);

export const VisibilityButton: React.FC<{
  goToCardEditor: (cardId: number) => void;
  cardId: number;
}> = ({ goToCardEditor, cardId }) => (
  <IconButton size="small" onClick={() => goToCardEditor(cardId)}>
    <VisibilityIcon fontSize="small" />
  </IconButton>
);

export const RemoveButton: React.FC<{
  cardName: string;
  onRemoveCard: (cardName: string) => void;
}> = ({ cardName, onRemoveCard }) => (
  <IconButton size="small" onClick={() => onRemoveCard(cardName)}>
    <ClearIcon fontSize="small" />
  </IconButton>
);
