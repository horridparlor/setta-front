import React, { useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';

interface SpecialEffectsTabProps {
  updatePromptValues: (values: Partial<{ effect: string }>) => void;
}

const SpecialEffectsTab: React.FC<SpecialEffectsTabProps> = ({ updatePromptValues }) => {
  const [effect, setEffect] = useState<string>('');

  const handleEffectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEffect = event.target.value;
    setEffect(newEffect);
    updatePromptValues({ effect: newEffect });
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
        />
      </Box>
    </Box>
  );
};

export default SpecialEffectsTab;
