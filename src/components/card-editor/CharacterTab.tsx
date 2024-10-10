import React, { useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  Box,
  Tab,
  Tabs,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';

interface CharacterTabProps {
    updatePromptValues: (values: Partial<any>) => void;
  }
   
  const CharacterTab: React.FC<CharacterTabProps> = ({ updatePromptValues }) => {
    const [characterFields, setCharacterFields] = useState({
      name: '',
      race: '',
      gender: '',
      age: '',
      type: '',
      appearance: '',
      tool: '',
      action: '',
      search: '',
      who: '', 
    });
  
    const handleInputChange = (field: string) => (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
    ) => {
      const newValue = event.target.value;
      setCharacterFields(prevFields => ({ ...prevFields, [field]: newValue }));
      updatePromptValues({ [field]: newValue });
    };
    const [characterSubTabId, setCharacterSubTabId] = useState(0);

    // Function to handle character sub-tab changes
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
        <Tab label="Character1" />
        <Tab label="Character2" />
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
          />
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Name"
            label="Name"
            value={characterFields.name}
            onChange={handleInputChange('name')}
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
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
            <FormControl fullWidth>
                <InputLabel id="race-selector-label">Race</InputLabel>
                <Select
                labelId="race-selector-label"
                value={characterFields.race || ''}
                label="Race"
                onChange={handleInputChange('race')}
                >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="Human">Human</MenuItem>
                <MenuItem value="Elf">Elf</MenuItem>
                <MenuItem value="Dwarf">Dwarf</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="gender-selector-label">Gender</InputLabel>
                <Select
                labelId="gender-selector-label"
                value={characterFields.gender || ''}
                label="Gender"
                onChange={handleInputChange('gender')}
                >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="age-selector-label">Age</InputLabel>
                <Select
                labelId="age-selector-label"
                value={characterFields.age || ''}
                label="Age"
                onChange={handleInputChange('age')}
                >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="Young">Young</MenuItem>
                <MenuItem value="Adult">Adult</MenuItem>
                <MenuItem value="Old">Old</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="type-selector-label">Type</InputLabel>
                <Select
                labelId="type-selector-label"
                value={characterFields.type || ''}
                label="Type"
                onChange={handleInputChange('type')}
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
          />
          <TextField
            fullWidth
            variant="outlined"
            placeholder="What are you doing?"
            label="Action"
            value={characterFields.action}
            onChange={handleInputChange('action')}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CharacterTab;
