import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  CardClass,
  CardDeck,
  CardSubtype,
  CardSupertype,
  CardType,
} from '../../types/card';
import { ComparisonType, SortOption, SortOrder } from '../../types/filter';
import { CardOwner } from '../../types/user';
import { getUser } from '../../types/api';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardOwners: Array<CardOwner>;
  cardClass: string;
  handleCardClassChange: (event: SelectChangeEvent<string>) => void;
  cardType: string;
  handleCardTypeChange: (event: SelectChangeEvent<string>) => void;
  cardSubtype: string;
  handleCardSubtypeChange: (event: SelectChangeEvent<string>) => void;
  cardSupertype: string;
  handleCardSupertypeChange: (event: SelectChangeEvent<string>) => void;
  cardDeck: string;
  handleCardDeckChange: (event: SelectChangeEvent<string>) => void;
  sortOrder: string;
  handleSortOrderChange: (
    event: React.MouseEvent<HTMLElement>,
    newSortOrder: SortOrder | null
  ) => void;
  sortBy: string;
  handleSortByChange: (event: SelectChangeEvent<string>) => void;
  level: number;
  handleLevelChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  levelOperation: string;
  handleLevelOperationChange: (
    event: React.MouseEvent<HTMLElement>,
    value: string | null
  ) => void;
  atk: number;
  handleAtkChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  atkOperation: string;
  handleAtkOperationChange: (
    event: React.MouseEvent<HTMLElement>,
    value: string | null
  ) => void;
  def: number;
  handleDefChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  defOperation: string;
  handleDefOperationChange: (
    event: React.MouseEvent<HTMLElement>,
    value: string | null
  ) => void;
  isAce: boolean;
  handleIsAceChange: (value: boolean) => void;
  ownerId: string;
  handleOwnerIdChange: (event: SelectChangeEvent<string>) => void;
  isReleased: boolean;
  handleIsReleasedChange: (value: boolean) => void;
  isErrata: boolean;
  handleIsErrataChange: (value: boolean) => void;
  resultsCount: number;
  handleExportAll: () => void;
}

const getComparisonTypeToggleOptions = (): React.ReactElement => {
  return (
    <>
      <ToggleButton value={ComparisonType.MORE} aria-label="greater than">
        {'>'}
      </ToggleButton>
      <ToggleButton value={ComparisonType.EQUAL} aria-label="equal">
        {'='}
      </ToggleButton>
      <ToggleButton value={ComparisonType.LESS} aria-label="less than">
        {'<'}
      </ToggleButton>
    </>
  );
};

const FiltersModal: React.FC<FiltersModalProps> = ({
  isOpen,
  onClose,
  cardOwners,
  cardClass,
  cardType,
  cardSubtype,
  cardSupertype,
  cardDeck,
  sortOrder,
  sortBy,
  handleCardClassChange,
  handleCardTypeChange,
  handleCardSubtypeChange,
  handleCardSupertypeChange,
  handleCardDeckChange,
  handleSortOrderChange,
  handleSortByChange,
  level,
  handleLevelChange,
  levelOperation,
  handleLevelOperationChange,
  atk,
  handleAtkChange,
  atkOperation,
  handleAtkOperationChange,
  def,
  handleDefChange,
  defOperation,
  handleDefOperationChange,
  isAce,
  handleIsAceChange,
  ownerId,
  handleOwnerIdChange,
  isReleased,
  handleIsReleasedChange,
  isErrata,
  handleIsErrataChange,
  resultsCount,
  handleExportAll,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Additional Filters</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel id="card-type-selector-label">Card Type</InputLabel>
              <Select
                labelId="card-type-selector-label"
                value={cardType}
                label="Card Type"
                onChange={handleCardTypeChange}
              >
                <MenuItem value="">–</MenuItem>
                {Object.values(CardType).map(c => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel id="card-subtype-selector-label">Subtype</InputLabel>
              <Select
                labelId="card-subtype-selector-label"
                value={cardSubtype}
                label="Subtype"
                onChange={handleCardSubtypeChange}
              >
                <MenuItem value="">–</MenuItem>
                {Object.values(CardSubtype).map(c => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel id="card-supertype-selector-label">
                Supertype
              </InputLabel>
              <Select
                labelId="card-supertype-selector-label"
                value={cardSupertype}
                label="Supertype"
                onChange={handleCardSupertypeChange}
              >
                <MenuItem value="">–</MenuItem>
                {Object.values(CardSupertype).map(c => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel id="class-selector-label">Class</InputLabel>
              <Select
                labelId="class-selector-label"
                value={cardClass}
                label="Class"
                onChange={handleCardClassChange}
              >
                <MenuItem value="">–</MenuItem>
                {Object.values(CardClass).map(c => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel id="deck-selector-label">Deck</InputLabel>
              <Select
                labelId="deck-selector-label"
                value={cardDeck}
                label="Deck"
                onChange={handleCardDeckChange}
              >
                <MenuItem value="">–</MenuItem>
                {Object.values(CardDeck).map(c => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel id="owner-selector-label">Creator</InputLabel>
              <Select
                labelId="owner-selector-label"
                value={ownerId}
                label="Creator"
                onChange={handleOwnerIdChange}
              >
                <MenuItem value="">–</MenuItem>
                {cardOwners.map(owner => (
                  <MenuItem key={owner.id} value={owner.id}>
                    {owner.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}></Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth sx={{ m: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAce}
                    onChange={e => handleIsAceChange(e.target.checked)}
                  />
                }
                label="Ace"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Level"
              variant="outlined"
              type="number"
              value={level}
              onChange={handleLevelChange}
              inputProps={{
                min: 1,
                max: 9,
                step: 1,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ToggleButtonGroup
              value={levelOperation}
              exclusive
              onChange={handleLevelOperationChange}
              aria-label="text alignment"
            >
              {getComparisonTypeToggleOptions()}
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={3}></Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              sx={{ display: getUser().accessRights.isAdmin ? 'flex' : 'none' }}
              onClick={handleExportAll}
              variant="contained"
              color="secondary"
              disabled={!resultsCount}
            >
              Export ALL
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Atk"
              variant="outlined"
              type="number"
              value={atk}
              onChange={handleAtkChange}
              inputProps={{
                min: 0,
                max: 2600,
                step: 100,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ToggleButtonGroup
              value={atkOperation}
              exclusive
              onChange={handleAtkOperationChange}
              aria-label="text alignment"
            >
              {getComparisonTypeToggleOptions()}
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Def"
              variant="outlined"
              type="number"
              value={def}
              onChange={handleDefChange}
              inputProps={{
                min: 0,
                max: 2500,
                step: 100,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ToggleButtonGroup
              value={defOperation}
              exclusive
              onChange={handleDefOperationChange}
              aria-label="text alignment"
            >
              {getComparisonTypeToggleOptions()}
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel id="sort-by-selector-label">Sort By</InputLabel>
              <Select
                labelId="sort-by-selector-label"
                value={sortBy.length ? sortBy : SortOption.UPDATED_AT}
                label="Sort By"
                onChange={handleSortByChange}
              >
                <MenuItem value="">–</MenuItem>
                {Object.values(SortOption).map(c => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" gutterBottom>
              Sort Order
            </Typography>
            <ToggleButtonGroup
              value={sortOrder.length ? sortOrder : SortOrder.ASCENDING}
              exclusive
              onChange={handleSortOrderChange}
              aria-label="text alignment"
            >
              <ToggleButton
                value={SortOrder.ASCENDING}
                aria-label="left aligned"
              >
                ASC
              </ToggleButton>
              <ToggleButton value={SortOrder.DESCENDING} aria-label="centered">
                DESC
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth sx={{ m: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isReleased}
                    onChange={e => handleIsReleasedChange(e.target.checked)}
                  />
                }
                label="Released"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth sx={{ m: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isErrata}
                    onChange={e => handleIsErrataChange(e.target.checked)}
                  />
                }
                label="Errata"
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FiltersModal;
