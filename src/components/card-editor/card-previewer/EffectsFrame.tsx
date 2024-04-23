import React from 'react';
import { Typography } from '@mui/material';
import { CardData, CardType } from "../../../types/card";
import { CardEffectFrameColor } from "../../../types/color";

interface EffectsFrameProps {
    cardData: CardData;
}

const EffectsFrame: React.FC<EffectsFrameProps> = ({ cardData }) => {
    const getEffectFrameColor = () => {
        switch (cardData.cardType) {
            case CardType.MONSTER:
                return CardEffectFrameColor.EFFECT;
            case CardType.SPELL:
                return CardEffectFrameColor.SPELL;
            case CardType.TRAP:
                return CardEffectFrameColor.TRAP;
            default:
                return 'defaultColor';
        }
    };

    return (
        <Typography variant="subtitle1" sx={{
            textAlign: 'left',
            padding: '2rem',
            paddingLeft: '0.9rem',
            paddingTop: '0.5rem',
            backgroundColor: getEffectFrameColor(),
            borderRadius: '0.4rem',
            minHeight: '9.2rem',
            overflow: 'hidden',
            fontSize: '1.4rem',
            fontFamily: 'Montserrat, sans-serif',
            whiteSpace: 'pre-line',
            lineHeight: '1.4'
        }}>
            {cardData.effectText}
        </Typography>
    );
};

export default EffectsFrame;
