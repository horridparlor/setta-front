import React from 'react';
import { Typography } from '@mui/material';
import { formatText, getFontSize } from "../../../utils/fonts";
import {CardData, getMaximumExtension, MaximumPiece} from "../../../types/card";
import { getFrameTextColor } from "../../../types/color";

interface TopFrameProps {
    cardData: CardData;
    scale: number;
}

const NameFrame: React.FC<TopFrameProps> = ({ cardData, scale }) => {
    const getNameSize = () => {
        return 5 + cardData.nameSize;
    }
    const enrichName = (cardName: string) => {
        return (cardName.length ? cardName : 'Name')
            .replace(/{i}/g, `{bi=${getNameSize() - 1}}`)
            .replace(/The{\/i}/g, "The {/bi}")
            + getMaximumExtension(cardData);
    }

    return (
        <Typography variant="h5" component="h1" sx={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: '600',
            fontSize: getFontSize(getNameSize(), scale),
            textAlign: 'left',
            backgroundColor: 'transparent',
            borderRadius: '1rem',
            position: 'absolute',
            top: `${(2.5 - 0.105 * getNameSize()) * scale}rem`,
            left: `${1.9 * scale}rem`,
            zIndex: 1000,
            color: getFrameTextColor(cardData),
            whiteSpace: 'nowrap',
        }}>
            {formatText(enrichName(cardData.cardName), scale)}
        </Typography>
    );
};

export default NameFrame;
