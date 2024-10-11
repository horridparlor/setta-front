import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { CardType } from '../../types/card';

interface BackgroundTabProps {
  updatePromptValues: (values: Partial<{ backgroundDescription: string; backgroundType: string }>) => void;
}

const BackgroundTab: React.FC<BackgroundTabProps> = ({ updatePromptValues }) => {
  const [backgroundDescription, setBackgroundDescription] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string | undefined>(CardType.MONSTER);

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = event.target.value;
    setBackgroundDescription(newDescription);
    updatePromptValues({ backgroundDescription: newDescription });
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const newType = event.target.value as string;
    setSelectedType(newType);
    updatePromptValues({ backgroundType: newType });
  };

  return (
    <Box>
      <Box sx={{ marginBottom: '1rem' }}>
        <Typography variant="subtitle1">Description</Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="What's on your background?"
          value={backgroundDescription}
          onChange={handleDescriptionChange}
        />
      </Box>

      <Box sx={{ maxWidth: '200px', marginBottom: '4rem' }}>
        <FormControl fullWidth>
          <InputLabel id="background-type-selector-label">Type</InputLabel>
          <Select
            labelId="background-type-selector-label"
            value={selectedType || ''}
            label="Type"
            onChange={handleTypeChange}
          >
            {Object.values(CardType)
              .filter(value => value !== CardType.NONE) 
              .map((cardType) => (
                <MenuItem key={cardType} value={cardType}>
                  {cardType}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default BackgroundTab;
