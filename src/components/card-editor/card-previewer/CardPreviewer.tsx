import React from 'react';
import {Box, Card} from '@mui/material';
import {CardData, CardType, StatType} from '../../../types/card';
import NameFrame from './NameFrame';
import ArtFrame from './ArtFrame';
import StatFrame from './StatFrame';
import LevelFrame from './LevelFrame';
import EffectsFrame from './EffectsFrame';
import BackFrame from './BackFrame';
import AttributeCut from "./AttributeCut";
import AttributeFrame from "./AttributeFrame";
import CopyrightIndicator from "./CopyrightIndicator";
import AceFrame from "./AceFrame";


interface CardPreviewerProps {
    cardData: CardData;
    cardRef?: React.RefObject<HTMLDivElement>;
    scale: number;
    cards: Array<CardData>;
    overwriteArt?: File;
}

const CardPreviewer: React.FC<CardPreviewerProps> = ({ cardData, cardRef, scale, cards, overwriteArt }) => {
    const { cardName, level, atk, def, effectText } = cardData;
    return (
        <Card ref={cardRef} sx={{
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: 'transparent',
            borderRadius: `${1.5 * scale}rem`,
        }}>
            <ArtFrame cardData={cardData} scale={scale} overwriteArt={overwriteArt} />
            <BackFrame scale={scale} cardData={cardData} />
            <NameFrame scale={scale} cardData={cardData} />
            <AttributeCut scale={scale} cardData={cardData}/>
            <AttributeFrame scale={scale} cardData={cardData}/>
            <Box sx={{
                position: 'absolute',
                bottom: 28 * scale,
                left: 28 * scale,
                right: 28 * scale
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    visibility: cardData.cardType === CardType.MONSTER ? 'visible' : 'hidden',
                }}>
                    <LevelFrame level={level} scale={scale}/>
                    <StatFrame value={atk} statType={StatType.ATTACK} scale={scale}/>
                    <StatFrame value={def} statType={StatType.DEFENSE} scale={scale}/>
                    <Box style={{width: '0'}}/>
                </Box>
                <EffectsFrame cards={cards} cardData={cardData} scale={scale} />
            </Box>
            <CopyrightIndicator scale={scale} cardData={cardData}/>
            <AceFrame scale={scale} cardData={cardData}/>
        </Card>
    );
};

export default CardPreviewer;
