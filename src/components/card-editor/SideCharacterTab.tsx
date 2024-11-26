import React, { useState, ChangeEvent, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  InputAdornment,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { SelectChangeEvent } from '@mui/material/Select';

interface SideCharacterTabProps {
  updateSideCharacterValues: (values: Partial<any>) => void; // Thistransmits side character values
}

const SideCharacterTab: React.FC<SideCharacterTabProps> = ({
  updateSideCharacterValues,
}) => {
  const [sideCharacterFields, setSideCharacterFields] = useState({
    sideCharacterName: '',
    sideCharacterRace: '',
    sideCharacterGender: '',
    sideCharacterAge: '',
    sideCharacterType: '',
    sideCharacterAppearance: '',
    sideCharacterTool: '',
    sideCharacterAction: '',
  });

  // On component mount, transmit the default values
  useEffect(() => {
    updateSideCharacterValues(sideCharacterFields);
  }, []);

  // Function to handle input changes for text fields and dropdowns
  const handleInputChange =
    (field: string) =>
    (
      event:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<string>
    ) => {
      const newValue = event.target.value as string;
      setSideCharacterFields(prevFields => ({
        ...prevFields,
        [field]: newValue,
      }));
      updateSideCharacterValues({ [field]: newValue }); // Transmit the updated values
    };

  const clearField = (field: string) => () => {
    setSideCharacterFields(prevFields => ({ ...prevFields, [field]: '' }));
    updateSideCharacterValues({ [field]: '' });
  };

  return (
    <Box>
      <Typography variant="h6">Side Character</Typography>

      <Box sx={{ display: 'flex', gap: 2, marginTop: 2, marginBottom: 2 }}>
        <Button variant="outlined" color="error">
          Delete Character
        </Button>
      </Box>

      {/* Name */}
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Side Character Name"
          label="Name"
          value={sideCharacterFields.sideCharacterName}
          onChange={handleInputChange('sideCharacterName')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={clearField('sideCharacterName')}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Appearance */}
      <Box sx={{ marginBottom: '1rem' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="What does the side character look like?"
          label="Appearance"
          value={sideCharacterFields.sideCharacterAppearance}
          onChange={handleInputChange('sideCharacterAppearance')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={clearField('sideCharacterAppearance')}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {/* what side character it is*/}
      <FormControl fullWidth>
        <InputLabel id="type-selector-label">Type</InputLabel>
        <Select
          labelId="type-selector-label"
          value={sideCharacterFields.sideCharacterType}
          label="Type"
          onChange={handleInputChange('Charactertype')}
        >
          <MenuItem value="Supporting">Supporting</MenuItem>
          <MenuItem value="Antagonist">Antagonist</MenuItem>
          <MenuItem value="Background-actor">Background-actor</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SideCharacterTab;
