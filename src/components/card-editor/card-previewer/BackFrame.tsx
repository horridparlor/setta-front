import React from 'react';
import { Box } from '@mui/material';
import { CardData, CardType } from "../../../types/card";
import {CardMainFrameColor} from "../../../types/color";

interface BackFrameProps {
    scale: number;
    cardData: CardData;
}

const BackFrame: React.FC<BackFrameProps> = ({ scale, cardData }) => {
    const getBackgroundColor = () => {
        switch (cardData.cardType) {
            case CardType.MONSTER:
                return CardMainFrameColor.EFFECT;
            case CardType.SPELL:
                return CardMainFrameColor.SPELL;
            case CardType.TRAP:
                return CardMainFrameColor.TRAP;
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${30 * scale}rem`,
            height: `calc(${30 * scale * 1.43}rem)`,
            backgroundColor: CardMainFrameColor.FRAME,
            borderRadius: '1.5rem',
            padding: '0.8rem 0.6rem',
        }}>
            <Box sx={{
                width: '100%',
                height: '100%',
                backgroundColor: getBackgroundColor(),
                border: '0.2rem solid black',
                borderRadius: '0.8rem',
            }} />
        </Box>
    );
};

export default BackFrame;
