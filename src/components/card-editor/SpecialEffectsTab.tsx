import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface SpecialEffectsTabProps {
  updatePromptValues: (values: Partial<{ effect: string }>) => void;
}

const SpecialEffectsTab: React.FC<SpecialEffectsTabProps> = ({
  updatePromptValues,
}) => {
  // State to store the special effect
  const [effect, setEffect] = useState<string>('');

  // On component mount, transmit default effect to the prompt
  useEffect(() => {
    updatePromptValues({ effect });
  }, []);

  // Handle effect changes
  const handleEffectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEffect = event.target.value;
    setEffect(newEffect);
    updatePromptValues({ effect: newEffect }); // Transmit effect to parent
  };

  // Clear the effect field
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
          label="Special Effect"
          placeholder="Describe the special effect..."
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
