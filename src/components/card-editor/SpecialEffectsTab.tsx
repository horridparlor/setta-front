import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, InputAdornment, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface SpecialEffectsTabProps {
  updatePromptValues: (values: Partial<{ effect: string }>) => void;
}

const SpecialEffectsTab: React.FC<SpecialEffectsTabProps> = ({ updatePromptValues }) => {
  const [effect, setEffect] = useState<string>('');

  // Send the default effect value to the prompt box upon load
  useEffect(() => {
    updatePromptValues({ effect });
  }, [effect, updatePromptValues]);

  const handleEffectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEffect = event.target.value;
    setEffect(newEffect);
    updatePromptValues({ effect: newEffect });
  };

  const handleClearEffect = () => {
    setEffect('');
    updatePromptValues({ effect: '' });
  };

  return (
    <Box>
      <Typography variant="h6">Special Effects</Typography>
      <Box sx={{ marginBottom: '1rem' }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Effect"
          placeholder="Describe the special effect you wish to add..."
          value={effect}
          onChange={handleEffectChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClearEffect}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

export default SpecialEffectsTab;
