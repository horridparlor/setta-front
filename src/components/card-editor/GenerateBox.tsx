import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { toast } from 'react-toastify';

const GenerateBox: React.FC<any> = () => {
  const [selectedDate, setSelectedDate] = useState<string>('2024-10-03'); // Default selection of mock data
  const [dropdownItems] = useState<string[]>([
    '2024-10-01',
    '2024-10-02',
    '2024-10-03',
    // Mocked data;
  ]);

  const handleArrowLeftClick = () => {
    const currentIndex = dropdownItems.indexOf(selectedDate);
    if (currentIndex > 0) {
      setSelectedDate(dropdownItems[currentIndex - 1]);
    }
    toast.info('Moved to older generation');
  };

  const handleArrowRightClick = () => {
    const currentIndex = dropdownItems.indexOf(selectedDate);
    if (currentIndex < dropdownItems.length - 1) {
      setSelectedDate(dropdownItems[currentIndex + 1]);
    }
    toast.info('Moved to newer generation');
  };

  const handleDropdownChange = (event: SelectChangeEvent<string>) => {
    setSelectedDate(event.target.value as string);
    toast.info(`Selected generation: ${event.target.value}`);
  };

  return (
    <Box
      sx={{
        marginTop: '1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 1,
        paddingBottom: 2,
        paddingLeft: 0,
        paddingTop: 2,
        paddingRight: 0,
      }}
    >
      {/* Arrow button to shift to older generations */}
      <IconButton color="primary" onClick={handleArrowLeftClick}>
        <ArrowBackIos />
      </IconButton>

      {/* Dropdown for generation selection */}
      <FormControl variant="outlined" sx={{ minWidth: 200, bgcolor: 'white' }}>
        <InputLabel id="generation-select-label">Generation Date</InputLabel>
        <Select
          labelId="generation-select-label"
          id="generation-select"
          value={selectedDate}
          onChange={handleDropdownChange}
          label="Generation Date"
        >
          {dropdownItems.map(date => (
            <MenuItem key={date} value={date}>
              {date}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Arrow button to shift to newer generations */}
      <IconButton color="primary" onClick={handleArrowRightClick}>
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
};

export default GenerateBox;
