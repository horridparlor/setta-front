import React, { useState, ChangeEvent, useEffect } from 'react';
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

      {/* Race, Gender, and Age Fields */}
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        {/* Race */}
        <FormControl fullWidth>
          <InputLabel id="side-character-race-label">Race</InputLabel>
          <Select
            labelId="side-character-race-label"
            value={sideCharacterFields.sideCharacterRace}
            label="Race"
            onChange={handleInputChange('sideCharacterRace')}
          >
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="Human">Human</MenuItem>
            <MenuItem value="Animal">Animal</MenuItem>
            <MenuItem value="Beastial">Beastial</MenuItem>
            <MenuItem value="Monster">Monster</MenuItem>
            <MenuItem value="Abstract">Abstract</MenuItem>
          </Select>
        </FormControl>

        {/* Gender */}
        <FormControl fullWidth>
          <InputLabel id="side-character-gender-label">Gender</InputLabel>
          <Select
            labelId="side-character-gender-label"
            value={sideCharacterFields.sideCharacterGender}
            label="Gender"
            onChange={handleInputChange('sideCharacterGender')}
          >
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="Undefined">Undefined</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        </FormControl>

        {/* Age */}
        <FormControl fullWidth>
          <InputLabel id="side-character-age-label">Age</InputLabel>
          <Select
            labelId="side-character-age-label"
            value={sideCharacterFields.sideCharacterAge}
            label="Age"
            onChange={handleInputChange('sideCharacterAge')}
          >
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="Adult">Adult</MenuItem>
            <MenuItem value="Teen">Teen</MenuItem>
            <MenuItem value="Elderly">Elderly</MenuItem>
            <MenuItem value="Child">Child</MenuItem>
          </Select>
        </FormControl>
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
