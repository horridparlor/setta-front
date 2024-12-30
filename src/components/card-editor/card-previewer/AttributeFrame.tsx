import React from 'react';
import { Box, Typography } from '@mui/material';
import { CardData, CardType } from '../../../types/card';
import { getFontSize } from '../../../utils/fonts';
import { getFrameTextColor } from '../../../types/color';
import { AssetEndpoint, getAsset } from '../../../types/api';

interface AttributeFrameProps {
  scale: number;
  cardData: CardData;
}

const AttributeFrame: React.FC<AttributeFrameProps> = ({ scale, cardData }) => {
  const ICON_SIZE = 6.8;
  const getAttribute = () => {
    if (cardData.cardType === CardType.MONSTER) {
      return cardData.cardClass;
    }
    return cardData.cardType;
  };
  const getAttributeName = () => {
    const name: String = getAttribute();
    if (name === CardType.SPELL) {
      return 'Skill';
    }
    if (name === CardType.TRAP) {
      return 'Trick';
    }
    return name;
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        left: `${22.5 * scale + 0.3 / scale}rem`,
        top: `${1.7 * scale}rem`,
      }}
    >
      <img
        src={getAsset(
          AssetEndpoint.ATTRIBUTE_FRAME,
          getAttribute().toLowerCase()
        )}
        alt="Attribute icon"
        style={{
          width: `${ICON_SIZE * scale}rem`,
          height: `${ICON_SIZE * scale}rem`,
          position: 'absolute',
          top: `${-0.25 * scale}rem`,
        }}
      />
      <Typography
        variant="h6"
        sx={{
          position: 'absolute',
          fontWeight: '600',
          left: `${3.85 * scale}rem`,
          top: `${6.6 * scale}rem`,
          fontSize: getFontSize(3, scale),
          transform: 'translateX(-50%)',
          color: getFrameTextColor(cardData),
        }}
      >
        {getAttributeName()}
      </Typography>
    </Box>
  );
};

export default AttributeFrame;
