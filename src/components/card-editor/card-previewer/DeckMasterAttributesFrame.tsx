import React from 'react';
import { Box } from '@mui/material';
import { CardClass, CardData, isDeckMaster } from '../../../types/card';
import { AssetEndpoint, getAsset } from '../../../types/api';

interface DeckMasterAttributesFrameProps {
  scale: number;
  cardData: CardData;
}

const DeckMasterAttributesFrame: React.FC<DeckMasterAttributesFrameProps> = ({
  scale,
  cardData,
}) => {
  const FRAME_SIZE = 28;
  const ICON_SIZE = 9.4;
  const ICON_MARGIN = 0.3;
  const ICON_EDGE = (FRAME_SIZE - ICON_SIZE - 4 * ICON_MARGIN) / 2;
  const ICON_BETWEEN = 6;
  const TOP_MARGIN = 8.9;

  const getDeckMasterAttributeIcon = (cardClass: CardClass, edgeTo: number) => {
    return (
      <img
        src={getAsset(AssetEndpoint.ATTRIBUTE_FRAME, cardClass.toLowerCase())}
        alt="Attribute icon"
        style={{
          width: `${ICON_SIZE * scale}rem`,
          height: `${ICON_SIZE * scale}rem`,
          position: 'absolute',
          left: `${edgeTo * ICON_BETWEEN * scale}rem`,
          top: `${-0.25 * scale}rem`,
        }}
      />
    );
  };
  const isSecondaryClassDefined = Number(
    cardData.secondaryClass !== CardClass.NONE
  );

  return (
    <Box
      sx={{
        opacity: isDeckMaster(cardData) ? 1 : 0,
        position: 'absolute',
        left: `${ICON_EDGE * scale + ICON_MARGIN / scale}rem`,
        top: `${TOP_MARGIN * scale}rem`,
      }}
    >
      {isDeckMaster(cardData)
        ? getDeckMasterAttributeIcon(
            cardData.primaryClass,
            isSecondaryClassDefined
          )
        : ''}
      {isSecondaryClassDefined
        ? getDeckMasterAttributeIcon(
            cardData.secondaryClass,
            -isSecondaryClassDefined
          )
        : ''}
    </Box>
  );
};

export default DeckMasterAttributesFrame;
