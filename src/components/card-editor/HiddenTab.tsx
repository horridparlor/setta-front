import { useState } from 'react';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Collapse,
  Button,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

interface HiddenTabProps {
  hiddenCharacters: {
    who: string; // Character name/identifier
    prompt: string;
    values: any;
    type: string; // main, side or side2
  }[];
  onRestoreMain: (index: number) => void;
  onRestoreSide: (index: number) => void;
  onRestoreSide2: (index: number) => void;
}

const HiddenTab: React.FC<HiddenTabProps> = ({
  hiddenCharacters,
  onRestoreMain,
  onRestoreSide,
  onRestoreSide2,
}) => {
  // State to track which character's details are currently expanded
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Function to handle expanding/collapsing character details
  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Box>
      <Typography variant="h6">Hidden Characters</Typography>

      <List>
        {/*Loop through all hidden characters */}
        {hiddenCharacters.map((character, index) => (
          <Box key={index}>
            <ListItem
              sx={{ borderBottom: expandedIndex === index ? 'none' : 1 }}
            >
              <ListItemText primary={character.who} />
              <IconButton onClick={() => handleToggle(index)}>
                {expandedIndex === index ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </ListItem>
            <Collapse in={expandedIndex === index} timeout="auto">
              <Box
                sx={{
                  padding: 2,
                  borderBottom: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                }}
              >
                {/*Display the prompt of the character */}
                <Typography
                  sx={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}
                >
                  {character.prompt}
                </Typography>

                {/*Button to restore character based on its type */}
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (character.type === 'main') {
                      onRestoreMain(index);
                    } else if (character.type === 'side') {
                      onRestoreSide(index);
                    } else if (character.type === 'side2') {
                      onRestoreSide2(index);
                    }
                  }}
                >
                  Restore
                </Button>
              </Box>
            </Collapse>
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default HiddenTab;
