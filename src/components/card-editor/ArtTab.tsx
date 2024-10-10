import React, { useState } from 'react';
import { Box, Tab, Tabs, TextField, Typography } from '@mui/material';
import BackgroundTab from './BackgroundTab';
import CharacterTab from './CharacterTab';
import SpecialEffectsTab from './SpecialEffectsTab';

const ArtTab: React.FC = () => {
  const BACKGROUND_TAB = 0;
  const CHARACTER_TAB = 1;
  const SPECIAL_EFFECTS_TAB = 2;
  const [subTabId, setSubTabId] = useState<number>(0);

  // State to hold the values from different fields
  const [promptValues, setPromptValues] = useState<Record<string, string>>({});

  const handleSubTabChange = (_event: React.ChangeEvent<{}>, newId: number) => {
    setSubTabId(newId);
  };

  // Function to update the prompt values from different tabs
  const updatePromptValues = (newValues: Partial<any>) => {
    setPromptValues(prevValues => ({ ...prevValues, ...newValues }));
  };
  
  
  // Construct the prompt text based on the collected values
  const promptText = `Background: ${promptValues.backgroundDescription || 'N/A'}, 
  Type: ${promptValues.backgroundType || 'N/A'},
  Character: ${promptValues.characterName || 'N/A'},
  Race: ${promptValues.race || 'N/A'},
  Gender: ${promptValues.gender || 'N/A'},
  Age: ${promptValues.age || 'N/A'},
  Type: ${promptValues.characterType || 'N/A'},
  Appearance: ${promptValues.appearance || 'N/A'},
  Tool: ${promptValues.tool || 'N/A'},
  Action: ${promptValues.action || 'N/A'}`;

  return (
    <Box>
      <Tabs
        value={subTabId}
        onChange={handleSubTabChange}
        aria-label="art sub-tabs"
        sx={{ marginBottom: '1rem' }}
      >
        <Tab label="Background" />
        <Tab label="Character" />
        <Tab label="Special Effects" />
      </Tabs>

      {/* Display the relevant sub-tab */}
      <Box sx={{ display: subTabId === BACKGROUND_TAB ? 'block' : 'none' }}>
        <BackgroundTab updatePromptValues={updatePromptValues} />
      </Box>
      <Box sx={{ display: subTabId === CHARACTER_TAB ? 'block' : 'none' }}>
        <CharacterTab updatePromptValues={updatePromptValues} />
      </Box>
      <Box sx={{ display: subTabId === SPECIAL_EFFECTS_TAB ? 'block' : 'none' }}>
      {/*  <SpecialEffectsTab updatePromptValues={updatePromptValues} /> */}
      </Box>

      {/* Prompt Display Box */}
      <Box sx={{ marginTop: '2rem' }}>
        <Typography variant="h6">Current Prompt</Typography>
        <TextField
          fullWidth
          variant="outlined"
          multiline
          minRows={4}
          value={promptText}
          placeholder="Your prompt will appear here"
          InputProps={{
            readOnly: true,
          }}
        />
      </Box>
    </Box>
  );
};

export default ArtTab;
