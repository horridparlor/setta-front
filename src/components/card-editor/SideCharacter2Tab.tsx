import React, { ChangeEvent, useEffect } from 'react';
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

interface SideCharacter2TabProps {
  updateSideCharacter2Values: (values: Partial<any>) => void; // This transmits side character values
  deleteSideCharacter2: (character: {
    who: string;
    prompt: string;
    values: any;
    type: string;
  }) => void;
  sideCharacter2Fields: {
    sideCharacter2Name: string;
    sideCharacter2Type: string;
    sideCharacter2Appearance: string;
  };
  setSideCharacter2Fields: React.Dispatch<
    React.SetStateAction<{
      sideCharacter2Name: string;
      sideCharacter2Type: string;
      sideCharacter2Appearance: string;
    }>
  >;
}

const SideCharacter2Tab: React.FC<SideCharacter2TabProps> = ({
  updateSideCharacter2Values,
  deleteSideCharacter2,
  sideCharacter2Fields,
  setSideCharacter2Fields,
}) => {
  const defaultSideCharacter2Fields = {
    sideCharacter2Name: '',
    sideCharacter2Type: '',
    sideCharacter2Appearance: '',
  };

  // On component mount, transmit the default values
  useEffect(() => {
    updateSideCharacter2Values(sideCharacter2Fields);
  }, [sideCharacter2Fields, updateSideCharacter2Values]);

  // Function to handle input changes for text fields and dropdowns
  const handleInputChange =
    (field: string) =>
    (
      event:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<string>
    ) => {
      const newValue = event.target.value as string;
      setSideCharacter2Fields(prevFields => ({
        ...prevFields,
        [field]: newValue,
      }));
      updateSideCharacter2Values({ [field]: newValue }); // Transmit the updated values
    };

  const clearField = (field: string) => () => {
    setSideCharacter2Fields(prevFields => ({ ...prevFields, [field]: '' }));
    updateSideCharacter2Values({ [field]: '' });
  };

  // Move a side character 2 to the hidden characters list on hidden tab
  const handleDeleteSideCharacter2 = () => {
    const newHiddenCharacter = {
      who: sideCharacter2Fields.sideCharacter2Name,
      prompt: `Side Character: ${sideCharacter2Fields.sideCharacter2Name}
      Side Character Appearance: ${sideCharacter2Fields.sideCharacter2Appearance}
      Side Character Type: ${sideCharacter2Fields.sideCharacter2Type}`,
      values: { ...sideCharacter2Fields },
      type: 'side2',
    };
    deleteSideCharacter2(newHiddenCharacter); // Add to hidden characters list
    setSideCharacter2Fields(defaultSideCharacter2Fields); // Clear fields
    updateSideCharacter2Values(defaultSideCharacter2Fields);
  };

  return (
    <Box>
      <Typography variant="h6">Side Character 2</Typography>

      <Box sx={{ display: 'flex', gap: 2, marginTop: 2, marginBottom: 2 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteSideCharacter2}
        >
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
          value={sideCharacter2Fields.sideCharacter2Name}
          onChange={handleInputChange('sideCharacter2Name')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={clearField('sideCharacter2Name')}>
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
          value={sideCharacter2Fields.sideCharacter2Appearance}
          onChange={handleInputChange('sideCharacter2Appearance')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={clearField('sideCharacter2Appearance')}>
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
          value={sideCharacter2Fields.sideCharacter2Type}
          label="Type"
          onChange={handleInputChange('sideCharacter2Type')}
        >
          <MenuItem value="Supporting">Supporting</MenuItem>
          <MenuItem value="Antagonist">Antagonist</MenuItem>
          <MenuItem value="Background-actor">Background-actor</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SideCharacter2Tab;
