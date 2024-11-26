import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { SelectChangeEvent } from '@mui/material/Select'; // Import correct SelectChangeEvent

interface BackgroundTabProps {
  updatePromptValues: (
    values: Partial<{ backgroundDescription: string; backgroundType: string }>
  ) => void;
}

const BackgroundTab: React.FC<BackgroundTabProps> = ({
  updatePromptValues,
}) => {
  const [backgroundDescription, setBackgroundDescription] =
    useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  // Transmit the default background type to the promptbox
  useEffect(() => {
    updatePromptValues({ backgroundType: selectedType });
  }, [selectedType, updatePromptValues]);

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newDescription = event.target.value;
    setBackgroundDescription(newDescription);
    updatePromptValues({ backgroundDescription: newDescription });
  };

  // Fix the type for the event argument here to SelectChangeEvent<string>
  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const newType = event.target.value;
    setSelectedType(newType);
    updatePromptValues({ backgroundType: newType });
  };

  const clearField = () => {
    setBackgroundDescription('');
    updatePromptValues({ backgroundDescription: '' });
  };

  return (
    <Box>
      <Box sx={{ marginBottom: '1rem' }}>
        <Typography variant="subtitle1">Background Description</Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="What's on your background?"
          value={backgroundDescription}
          onChange={handleDescriptionChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={clearField}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ maxWidth: '200px', marginBottom: '4rem' }}>
        <FormControl fullWidth>
          <InputLabel id="background-type-selector-label">Type</InputLabel>
          <Select
            labelId="background-type-selector-label"
            value={selectedType || ''}
            label="Type"
            onChange={handleTypeChange} // Correct handler with SelectChangeEvent type
          >
            <MenuItem value="Indoors">Indoors</MenuItem>
            <MenuItem value="Outdoors">Outdoors</MenuItem>
            <MenuItem value="Abstract">Abstract</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default BackgroundTab;
