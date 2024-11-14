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
  hiddenCharacters: { who: string; prompt: string; values: any }[];
  onRestore: (index: number) => void; // Pass index for restoration
}

const HiddenTab: React.FC<HiddenTabProps> = ({
  hiddenCharacters,
  onRestore,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Box>
      <Typography variant="h6">Hidden Characters</Typography>
      <List>
        {hiddenCharacters.map((character, index) => (
          <Box key={index}>
            <ListItem>
              <ListItemText primary={character.who} />
              <IconButton onClick={() => handleToggle(index)}>
                {expandedIndex === index ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </ListItem>
            <Collapse in={expandedIndex === index} timeout="auto">
              <Box
                sx={{
                  p: 2,
                  border: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                }}
              >
                <Typography
                  sx={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}
                >
                  {character.prompt}
                </Typography>
                <Button variant="outlined" onClick={() => onRestore(index)}>
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
