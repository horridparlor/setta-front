import React, { useState, ChangeEvent, useEffect } from 'react';
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
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { SelectChangeEvent } from '@mui/material/Select';
import SideCharacterTab from './SideCharacterTab';
import SideCharacter2Tab from './SideCharacter2Tab';
import HiddenTab from './HiddenTab';

interface CharacterTabProps {
  updatePromptValues: (values: Partial<any>) => void; // This will include even non-prompt values like race, gender, etc.
}

const CharacterTab: React.FC<CharacterTabProps> = ({ updatePromptValues }) => {
  // Full character object, including fields not directly displayed in the prompt
  const [characterFields, setCharacterFields] = useState({
    characterName: '',
    race: 'Human',
    gender: 'Male',
    age: 'Adult',
    charactertype: 'Main',
    appearance: '',
    tool: '',
    inherited_tool: false,
    action: '',
    search: '',
    who: '',
  });
  const [showSelect, setShowSelect] = useState<boolean>(false);
  const [user, setUser] = useState<string>('');
  const [isFieldsActive, setFieldsActive] = useState<boolean>(false);

  // On component mount, this transmits the default values to the prompt object
  useEffect(() => {
    updatePromptValues(characterFields);
  }, []);

  useEffect(() => {
    setFieldsActive(
      // Set fields to active if search or who is entered
      characterFields.search.trim() !== '' || characterFields.who.trim() !== ''
    );
  }, [characterFields.search, characterFields.who]);

  // Function to handle input changes for text fields and dropdowns
  const handleInputChange =
    (field: string) =>
    (
      event:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<string>
    ) => {
      const newValue = event.target.value as string;
      setCharacterFields(prevFields => ({ ...prevFields, [field]: newValue }));
      updatePromptValues({ [field]: newValue });
    };

  const clearField = (field: string) => () => {
    setCharacterFields(prevFields => ({ ...prevFields, [field]: '' }));
    updatePromptValues({ [field]: '' });
  };

  // Impersonate checkbox change
  const handleImpersonateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShowSelect(event.target.checked);
  };

  // Function for impersonate user selector
  const handleUserSelectChange = (event: SelectChangeEvent<string>) => {
    const newUser = event.target.value as string;
    setUser(newUser);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setCharacterFields(prevFields => ({
      ...prevFields,
      inherited_tool: newValue,
    }));
    updatePromptValues({ inherited_tool: newValue });
  };
  const [characterSubTabId, setCharacterSubTabId] = useState(0);

  const handleCharacterSubTabChange = (
    _event: React.ChangeEvent<unknown>,
    newValue: number
  ) => {
    setCharacterSubTabId(newValue);
  };

  // Sub-tab
  const NEW_CHARACTER_TAB = 0;
  const SIDE_CHARACTER_TAB = 1;
  const SIDE_CHARACTER2_TAB = 2;
  const HIDDEN_TAB = 3;

  return (
    <Box>
      <Tabs
        value={characterSubTabId}
        onChange={handleCharacterSubTabChange}
        aria-label="character sub-tabs"
      >
        <Tab label="Main Character" />
        <Tab label="Side Character" />
        <Tab label="Side Character 2" />
        <Tab label="Hidden" />
      </Tabs>

      <Box
        sx={{
          display: characterSubTabId === NEW_CHARACTER_TAB ? 'block' : 'none',
        }}
      >
        <Typography variant="h6">Main Character</Typography>

        <Box sx={{ display: 'flex', gap: 2, marginTop: 2, marginBottom: 2 }}>
          <Button variant="outlined" color="error">
            Delete Character
          </Button>
        </Box>

        <Box>
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

        <Box sx={{ display: 'flex', gap: 2, marginTop: 2, marginBottom: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={showSelect}
                onChange={handleImpersonateChange}
              />
            }
            label="Impersonate"
          />

          {/*If impersonate checked, select user and style */}
          {showSelect && (
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <FormControl fullWidth>
                <InputLabel id="select-user">Select User</InputLabel>
                <Select
                  labelId="select-user"
                  value={user}
                  label="User"
                  onChange={handleUserSelectChange}
                >
                  <MenuItem value="User">Users coming soon...</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
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
          {characterFields.characterName && (
            <Button variant="contained" color="primary">
              Save Character
            </Button>
          )}
        </Box>

        <Box sx={{ marginBottom: '1rem' }}>
          <Typography
            variant="subtitle1"
            sx={{ color: isFieldsActive ? 'text.primary' : 'gray' }}
          >
            Appearance
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="What do you look like?"
            value={characterFields.appearance}
            onChange={handleInputChange('appearance')}
            disabled={!isFieldsActive}
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
          {/* Race Selection */}
          <FormControl fullWidth disabled={!isFieldsActive}>
            <InputLabel id="race-selector-label">Race</InputLabel>
            <Select
              labelId="race-selector-label"
              value={characterFields.race}
              label="Race"
              onChange={handleInputChange('race')}
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Human">Human</MenuItem>
              <MenuItem value="Animal">Animal</MenuItem>
              <MenuItem value="Beastial">Beastial</MenuItem>
              <MenuItem value="Monster">Monster</MenuItem>
              <MenuItem value="Abstract">Abstract</MenuItem>
            </Select>
          </FormControl>

          {/* Gender Selection */}
          <FormControl fullWidth disabled={!isFieldsActive}>
            <InputLabel id="gender-selector-label">Gender</InputLabel>
            <Select
              labelId="gender-selector-label"
              value={characterFields.gender}
              label="Gender"
              onChange={handleInputChange('gender')}
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Undefined">Undefined</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>

          {/* Age Selection */}
          <FormControl fullWidth disabled={!isFieldsActive}>
            <InputLabel id="age-selector-label">Age</InputLabel>
            <Select
              labelId="age-selector-label"
              value={characterFields.age}
              label="Age"
              onChange={handleInputChange('age')}
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Adult">Adult</MenuItem>
              <MenuItem value="Teen">Teen</MenuItem>
              <MenuItem value="Elderly">Elderly</MenuItem>
              <MenuItem value="Child">Child</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Tool and Action fields */}
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="What kind of tool do they use?"
            label="Tool"
            value={characterFields.tool}
            onChange={handleInputChange('tool')}
            disabled={!isFieldsActive}
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
          <FormControlLabel
            disabled={!isFieldsActive}
            control={
              <Checkbox
                checked={characterFields.inherited_tool}
                onChange={handleCheckboxChange} // Toggle inherited_tool
                name="situational"
                color="primary"
              />
            }
            label="Situational"
          />

          <TextField
            fullWidth
            variant="outlined"
            placeholder="What are you doing?"
            label="Action"
            value={characterFields.action}
            onChange={handleInputChange('action')}
            disabled={!isFieldsActive}
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
      <Box
        sx={{
          display: characterSubTabId === SIDE_CHARACTER_TAB ? 'block' : 'none',
        }}
      >
        <SideCharacterTab updateSideCharacterValues={updatePromptValues} />
      </Box>
      <Box
        sx={{
          display: characterSubTabId === SIDE_CHARACTER2_TAB ? 'block' : 'none',
        }}
      >
        <SideCharacter2Tab updateSideCharacter2Values={updatePromptValues} />
      </Box>
      <Box
        sx={{
          display: characterSubTabId === HIDDEN_TAB ? 'block' : 'none',
        }}
      >
        <HiddenTab />
      </Box>
    </Box>
  );
};

export default CharacterTab;
