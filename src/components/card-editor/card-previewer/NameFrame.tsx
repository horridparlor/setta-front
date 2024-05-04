import React from 'react';
import { Typography } from '@mui/material';
import {formatText, getFontSize} from "../../../utils/fonts";
import {CardData} from "../../../types/card";
import {getFrameTextColor} from "../../../types/color";

interface TopFrameProps {
    cardData: CardData;
    scale: number;
}

const NameFrame: React.FC<TopFrameProps> = ({ cardData, scale }) => (
    <Typography variant="h5" component="h1" sx={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: '600',
        fontSize: getFontSize(8, scale),
        textAlign: 'left',
        backgroundColor: 'transparent',
        borderRadius: '1rem',
        position: 'absolute',
        top: `${1.6 * scale}rem`,
        left: `${1.9 * scale}rem`,
        zIndex: 1000,
        color: getFrameTextColor(cardData),
    }}>
        {formatText(cardData.cardName, scale)}
    </Typography>
);

export default NameFrame;
