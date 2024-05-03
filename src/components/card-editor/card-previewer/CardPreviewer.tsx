import React from 'react';
import {Box, Card} from '@mui/material';
import {CardData, StatType} from '../../../types/card';
import NameFrame from './NameFrame';
import ArtFrame from './ArtFrame';
import StatFrame from './StatFrame';
import LevelFrame from './LevelFrame';
import EffectsFrame from './EffectsFrame';
import BackFrame from './BackFrame';
import AttributeCut from "./AttributeCut";
import AttributeFrame from "./AttributeFrame";


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
            <NameFrame scale={scale} name={cardName} />
            <ArtFrame imageUrl={'https://setta.fi/rush-api/assets/card-art/hammer-waifu.png'} scale={scale} />
            <AttributeCut scale={scale} cardData={cardData}/>
            <AttributeFrame scale={scale} cardData={cardData}/>
            <Box sx={{ position: 'absolute', bottom: 28, left: 28, right: 28 }}>
                <Box sx={{display: 'flex', justifyContent: 'space-around'}}>
                    <LevelFrame level={level} scale={scale}/>
                    <StatFrame value={atk} statType={StatType.ATTACK} scale={scale}/>
                    <StatFrame value={def} statType={StatType.DEFENSE} scale={scale}/>
                    <Box style={{width: '0'}}/>
                </Box>
                <EffectsFrame cardData={cardData} scale={scale} />
            </Box>
        </Card>
    );
};

export default CardPreviewer;
