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
    age: 'Young',
    charactertype: 'Main',
    appearance: '',
    tool: '',
    inherited_tool: false,
    action: '',
    search: '',
    who: '',
  });

  const [sideCharacterFields, setSideCharacterFields] = useState({
    sideCharacterName: '',
    sideCharacterType: '',
    sideCharacterAppearance: '',
  });

  const [sideCharacter2Fields, setSideCharacter2Fields] = useState({
    sideCharacter2Name: '',
    sideCharacter2Type: '',
    sideCharacter2Appearance: '',
  });

  const [hiddenCharacters, setHiddenCharacters] = useState<
    { who: string; prompt: string; values: any; type: string }[]
  >([]);
  const [showSelect, setShowSelect] = useState<boolean>(false);
  const [user, setUser] = useState<string>('');
  const [isFieldsActive, setFieldsActive] = useState<boolean>(false);

  const defaultCharacterFields = {
    characterName: '',
    race: 'Human',
    gender: 'Male',
    age: 'Young',
    charactertype: 'Main',
    appearance: '',
    tool: '',
    inherited_tool: false,
    action: '',
    search: '',
    who: '',
  };

  // On component mount, this transmits the default values to the prompt object
  useEffect(() => {
    updatePromptValues(characterFields);
  }, [characterFields, updatePromptValues]);

  useEffect(() => {
    setFieldsActive(
      // Set fields to active if 'search' or 'who' is entered
      (characterFields.search || '').trim() !== '' ||
        (characterFields.who || '').trim() !== ''
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

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setCharacterFields(prevFields => ({
      ...prevFields,
      inherited_tool: newValue,
    }));
    updatePromptValues({ inherited_tool: newValue });
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

  // Move a main character to the hidden list on hidden tab
  const handleDeleteMainCharacter = () => {
    const newHiddenCharacter = {
      who: characterFields.who,
      prompt: `Character: ${characterFields.characterName}
        Race: ${characterFields.race}
        Gender: ${characterFields.gender}
        Age: ${characterFields.age}
        Type: ${characterFields.charactertype}
        Appearance: ${characterFields.appearance}
        Tool: ${characterFields.tool}`,
      values: { ...characterFields },
      type: 'main',
    };

    // Add to hidden characters
    setHiddenCharacters(prevState => [...prevState, newHiddenCharacter]);
    // Clear fields
    setCharacterFields(defaultCharacterFields);
  };

  // Handle restoring a main character from the hidden characters list
  const handleRestoreMain = (index: number) => {
    const characterToRestore = hiddenCharacters[index];
    setCharacterFields(characterToRestore.values);
    updatePromptValues(characterToRestore.values);

    // Remove the character from hiddenCharacters
    setHiddenCharacters(prevHiddenCharacters =>
      prevHiddenCharacters.filter((_, i) => i !== index)
    );
  };

  // Handle restoring a side character
  const handleRestoreSide = (index: number) => {
    const characterToRestore = hiddenCharacters[index];
    setSideCharacterFields(characterToRestore.values);
    updatePromptValues(characterToRestore.values);

    setHiddenCharacters(prevHiddenCharacters =>
      prevHiddenCharacters.filter((_, i) => i !== index)
    );
  };

  // Handle restoring side character 2
  const handleRestoreSide2 = (index: number) => {
    const characterToRestore = hiddenCharacters[index];
    setSideCharacter2Fields(characterToRestore.values);
    updatePromptValues(characterToRestore.values);

    setHiddenCharacters(prevHiddenCharacters =>
      prevHiddenCharacters.filter((_, i) => i !== index)
    );
  };

  const [characterSubTabId, setCharacterSubTabId] = useState(0);

  const handleCharacterSubTabChange = (
    event: React.ChangeEvent<unknown>,
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
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteMainCharacter}
          >
            Delete Character
          </Button>
        </Box>

        <Typography variant="subtitle1">Character</Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            marginBottom: 2,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={showSelect}
                onChange={handleImpersonateChange}
              />
            }
            label="Impersonate"
          />

          {/*If impersonate checked, select user */}
          {showSelect && (
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
          )}
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
        <SideCharacterTab
          sideCharacterFields={sideCharacterFields}
          setSideCharacterFields={setSideCharacterFields}
          updateSideCharacterValues={updatePromptValues}
          deleteSideCharacter={character => {
            setHiddenCharacters(prev => [...prev, character]);
          }}
        />
      </Box>
      <Box
        sx={{
          display: characterSubTabId === SIDE_CHARACTER2_TAB ? 'block' : 'none',
        }}
      >
        <SideCharacter2Tab
          sideCharacter2Fields={sideCharacter2Fields}
          setSideCharacter2Fields={setSideCharacter2Fields}
          updateSideCharacter2Values={updatePromptValues}
          deleteSideCharacter2={character =>
            setHiddenCharacters(prev => [...prev, character])
          }
        />
      </Box>
      <Box
        sx={{
          display: characterSubTabId === HIDDEN_TAB ? 'block' : 'none',
        }}
      >
        <HiddenTab
          hiddenCharacters={hiddenCharacters}
          onRestoreMain={handleRestoreMain}
          onRestoreSide={handleRestoreSide}
          onRestoreSide2={handleRestoreSide2}
        />
      </Box>
    </Box>
  );
};

export default CharacterTab;
