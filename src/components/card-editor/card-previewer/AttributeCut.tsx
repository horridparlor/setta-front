import React from 'react';
import { Box } from '@mui/material';
import { CardData } from '../../../types/card';
import { getArtworkBorder } from '../../../types/color';

interface AttributeCutProps {
  scale: number;
  cardData: CardData;
}

const AttributeCut: React.FC<AttributeCutProps> = ({ scale }) => {
  const PANEL_SIZE = 4.8;
  const cutPanelStyle = {
    position: 'absolute',
    width: `${PANEL_SIZE * scale}rem`,
    height: `${PANEL_SIZE * scale}rem`,
    backgroundColor: 'transparent',
    padding: `${0.7 * scale + 0.1 / scale}rem ${0.6 * scale}rem`,
  };

  return (
    <>
      <Box
        sx={{
          top: `${5.15 * scale}rem`,
          left: `${23 * scale + 0.35 / scale}rem`,
          borderBottom: getArtworkBorder(scale),
          ...cutPanelStyle,
        }}
      ></Box>
      <Box
        sx={{
          top: `${4.25 * scale + 0.05 / scale}rem`,
          left: `${21.55 * scale + 0.3 / scale}rem`,
          transform: `rotate(-22.5deg)`,
          borderLeft: getArtworkBorder(scale),
          ...cutPanelStyle,
        }}
      ></Box>
    </>
  );
};

export default AttributeCut;
