import React from 'react';
import { Box, Button } from '@mui/material';
import { toast } from 'react-toastify';

interface GenerateBoxProps {
  onReset: () => void;
}

const GenerateBox: React.FC<GenerateBoxProps> = ({ onReset }) => {
  const handleGenerateClick = () => {
    // Logic for the Generate button click
    toast.info('Generating artwork...');
  };

  const handleReturnClick = () => {
    // Logic for the Return button click
    toast.info('Returning to the previous step...');
  };

  return (
    <Box sx={{ marginTop: '1rem', display: 'flex', gap: 2 }}>
      <Button variant="contained" color="primary" onClick={handleGenerateClick}>
        Generate
      </Button>
      <Button variant="outlined" color="primary" onClick={handleReturnClick}>
        Return
      </Button>
      <Button variant="outlined" color="error" onClick={onReset}>
        Reset
      </Button>
    </Box>
  );
};

export default GenerateBox;
