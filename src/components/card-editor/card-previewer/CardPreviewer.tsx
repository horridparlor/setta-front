import React from 'react';
import { Card, Box } from '@mui/material';
import { CardData } from '../../../types/card';
import TopFrame from './TopFrame';
import ArtFrame from './ArtFrame';
import StatFrame from './StatFrame';
import LevelFrame from './LevelFrame';
import EffectsFrame from './EffectsFrame';
import BackFrame from './BackFrame';
import {StatBoxColor} from "../../../types/color";


interface CardPreviewerProps {
    cardData: CardData;
    cardRef: React.RefObject<HTMLDivElement>;
    scale: number;
}

const CardPreviewer: React.FC<CardPreviewerProps> = ({ cardData, cardRef, scale }) => {
    const { cardName, level, atk, def, effectText } = cardData;

    return (
        <Card ref={cardRef} sx={{
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'Montserrat, sans-serif',
            backgroundColor: 'transparent',
            borderRadius: '0.4rem',
        }}>
            <BackFrame scale={scale} cardData={cardData} />
            <TopFrame scale={scale} name={cardName} />
            <ArtFrame imageUrl={'https://setta.fi/rush-api/assets/card-art/hammer-waifu.png'} scale={scale} />
            <Box sx={{ position: 'absolute', bottom: 28, left: 28, right: 28 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                    <LevelFrame level={level} />
                    <StatFrame label="ATK" value={atk} color={StatBoxColor.ATK} />
                    <StatFrame label="DEF" value={def} color={StatBoxColor.DEF} />
                </Box>
                <EffectsFrame cardData={cardData} />
            </Box>
        </Card>
    );
};

export default CardPreviewer;
