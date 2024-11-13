import React from 'react';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';

const HiddenTab: React.FC = () => {
  // mock data
  const testCharacters = [{ who: 'Who1' }, { who: 'Who2' }, { who: 'Who3' }];

  return (
    <Box>
      <Typography variant="h6">Hidden Characters</Typography>
      <List>
        {testCharacters.map((character, index) => (
          <ListItem key={index}>
            <ListItemText>{character.who}</ListItemText>
            {/*Button to unhide characters */}
            <Tooltip title="Unhide">
              <IconButton>
                <Visibility />
              </IconButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default HiddenTab;
