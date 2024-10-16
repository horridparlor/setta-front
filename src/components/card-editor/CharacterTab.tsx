import React, { useState, ChangeEvent, useEffect } from 'react';
import { Box, Tab, Tabs, TextField, Typography, FormControl, InputLabel, Select, MenuItem, Button, IconButton, InputAdornment } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { SelectChangeEvent } from '@mui/material/Select';

interface CharacterTabProps {
  updatePromptValues: (values: Partial<any>) => void;
}

const CharacterTab: React.FC<CharacterTabProps> = ({ updatePromptValues }) => {
  const [characterFields, setCharacterFields] = useState({
    characterName: '',
    race: 'Human',
    gender: 'Male',
    age: 'Young',
    Charactertype: 'Main',
    appearance: '',
    tool: '',
    action: '',
    search: '',
    who: '',
  });

  // Use useEffect to transmit the default values to the promptbox
  useEffect(() => {
    updatePromptValues(characterFields);
  }, []);

  const handleInputChange = (field: string) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const newValue = event.target.value as string;
    setCharacterFields(prevFields => ({ ...prevFields, [field]: newValue }));
    updatePromptValues({ [field]: newValue });
  };

  const clearField = (field: string) => () => {
    setCharacterFields(prevFields => ({ ...prevFields, [field]: '' }));
    updatePromptValues({ [field]: '' });
  };

  const [characterSubTabId, setCharacterSubTabId] = useState(0);

  const handleCharacterSubTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setCharacterSubTabId(newValue);
  };

  const NEW_CHARACTER_TAB = 0;
  const CHARACTER1_TAB = 1;
  const CHARACTER2_TAB = 2;
  const HIDDEN_TAB = 3;

  return (
    <Box>
      <Tabs
        value={characterSubTabId}
        onChange={handleCharacterSubTabChange}
        aria-label="character sub-tabs"
      >
        <Tab label="New Character" />
        <Tab label="Character 1" />
        <Tab label="Character 2" />
        <Tab label="Hidden" />
      </Tabs>

      <Box sx={{ display: characterSubTabId === NEW_CHARACTER_TAB ? 'block' : 'none' }}>
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <Button variant="contained" color="primary">
            Hide Character
          </Button>
          <Button variant="outlined" color="error">
            Delete Character
          </Button>
        </Box>

        <Box sx={{ marginBottom: '1rem' }}>
          <Typography variant="subtitle1">Character</Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search..."
            value={characterFields.search}
            onChange={handleInputChange('search')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={clearField('search')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Who is your character?"
            label="Who"
            value={characterFields.who}
            onChange={handleInputChange('who')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={clearField('who')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Name"
            label="Name"
            value={characterFields.characterName}
            onChange={handleInputChange('characterName')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={clearField('characterName')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ marginBottom: '1rem' }}>
          <Typography variant="subtitle1">Appearance</Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="What do you look like?"
            value={characterFields.appearance}
            onChange={handleInputChange('appearance')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={clearField('appearance')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="race-selector-label">Race</InputLabel>
            <Select
              labelId="race-selector-label"
              value={characterFields.race}
              label="Race"
              onChange={handleInputChange('race')}
            >
              <MenuItem value="Human">Human</MenuItem>
              <MenuItem value="Elf">Elf</MenuItem>
              <MenuItem value="Dwarf">Dwarf</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="gender-selector-label">Gender</InputLabel>
            <Select
              labelId="gender-selector-label"
              value={characterFields.gender}
              label="Gender"
              onChange={handleInputChange('gender')}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="age-selector-label">Age</InputLabel>
            <Select
              labelId="age-selector-label"
              value={characterFields.age}
              label="Age"
              onChange={handleInputChange('age')}
            >
              <MenuItem value="Young">Young</MenuItem>
              <MenuItem value="Adult">Adult</MenuItem>
              <MenuItem value="Old">Old</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="type-selector-label">Type</InputLabel>
            <Select
              labelId="type-selector-label"
              value={characterFields.Charactertype}
              label="Type"
              onChange={handleInputChange('Charactertype')}
            >
              <MenuItem value="Main">Main</MenuItem>
              <MenuItem value="Supporting">Supporting</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="What kind of tool do you use?"
            label="Tool"
            value={characterFields.tool}
            onChange={handleInputChange('tool')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={clearField('tool')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            placeholder="What are you doing?"
            label="Action"
            value={characterFields.action}
            onChange={handleInputChange('action')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={clearField('action')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CharacterTab;
