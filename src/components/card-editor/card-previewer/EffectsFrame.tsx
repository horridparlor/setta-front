import React from 'react';
import {Box, Typography} from '@mui/material';
import { CardData } from "../../../types/card";
import {getCardEffectFrameColor, getEffectsBorder} from "../../../types/color";
import {formatText, getFontSize} from "../../../utils/fonts";

interface EffectsFrameProps {
    cardData: CardData;
    scale: number;
}

const EffectsFrame: React.FC<EffectsFrameProps> = ({ cardData, scale }) => {
    return (
        <Typography variant="subtitle1" sx={{
            textAlign: 'left',
            paddingLeft: '0.7rem',
            paddingRight: '0.5rem',
            paddingTop: '0.3rem',
            backgroundColor: getCardEffectFrameColor(cardData),
            borderRadius: '0.4rem',
            height: '11.6rem',
            overflow: 'hidden',
            fontSize: getFontSize(4, scale),
            whiteSpace: 'pre-line',
            lineHeight: '1.4',
            fontWeight: '400',
            border: getEffectsBorder(cardData, scale),
        }}>
            {formatText(cardData.effectText, scale)}
            <Box
                sx={{
                    flexGrow: 1,
                    marginTop: `${0.4 * scale}rem`,
                    height: `${0.1 * scale}rem`,
                    backgroundColor: 'black',
                    opacity: 0.2,
                }}
            />
        </Typography>
    );
};

export default EffectsFrame;
