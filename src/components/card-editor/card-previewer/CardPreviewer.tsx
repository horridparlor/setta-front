import React from 'react';
import { Box, Card } from '@mui/material';
import { CardData, isMonster, StatType } from '../../../types/card';
import NameFrame from './NameFrame';
import ArtFrame from './ArtFrame';
import StatFrame from './StatFrame';
import LevelFrame from './LevelFrame';
import EffectsFrame from './EffectsFrame';
import BackFrame from './BackFrame';
import AttributeCut from './AttributeCut';
import AttributeFrame from './AttributeFrame';
import CopyrightIndicator from './CopyrightIndicator';
import AceFrame from './AceFrame';
import { CardExpansion } from '../../../types/expansion.ts';
import DeckMasterAttributesFrame from './DeckMasterAttributesFrame.tsx';

interface CardPreviewerProps {
  cardData: CardData;
  expansions: Array<CardExpansion>;
  cardRef?: React.RefObject<HTMLDivElement>;
  scale: number;
  cards: Array<CardData>;
  overwriteArt?: File;
  oldName?: string;
}

const CardPreviewer: React.FC<CardPreviewerProps> = ({
  cardData,
  expansions,
  cardRef,
  scale,
  cards,
  overwriteArt,
  oldName,
}) => {
  const { atk, def } = cardData;
  return (
    <Card
      ref={cardRef}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'transparent',
        borderRadius: `${1.5 * scale}rem`,
      }}
    >
      <ArtFrame
        cardData={cardData}
        scale={scale}
        overwriteArt={overwriteArt}
        oldName={oldName}
      />
      <BackFrame scale={scale} cardData={cardData} />
      <NameFrame scale={scale} cardData={cardData} />
      <AttributeCut scale={scale} cardData={cardData} />
      <AttributeFrame scale={scale} cardData={cardData} />
      <Box
        sx={{
          position: 'absolute',
          bottom: 28 * scale,
          left: 28 * scale,
          right: 28 * scale,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <LevelFrame cardData={cardData} scale={scale} />
          <Box sx={{ visibility: isMonster(cardData) ? 'visible' : 'hidden' }}>
            <StatFrame value={atk} statType={StatType.ATTACK} scale={scale} />
          </Box>
          <Box sx={{ visibility: isMonster(cardData) ? 'visible' : 'hidden' }}>
            <StatFrame value={def} statType={StatType.DEFENSE} scale={scale} />
          </Box>
          <Box style={{ width: '0' }} />
        </Box>
        <EffectsFrame cards={cards} cardData={cardData} scale={scale} />
        <DeckMasterAttributesFrame cardData={cardData} scale={scale} />
      </Box>
      <CopyrightIndicator
        scale={scale}
        cardData={cardData}
        expansions={expansions}
      />
      <AceFrame scale={scale} cardData={cardData} />
    </Card>
  );
};

export default CardPreviewer;
