import React from 'react';
import {Box} from '@mui/material';
import {CardData, CardSubtype, CardType} from "../../../types/card";
import {CardMainFrameColor, getCardBackgroundColor} from "../../../types/color";

interface BackFrameProps {
    scale: number;
    cardData: CardData;
}

const BackFrame: React.FC<BackFrameProps> = ({ scale, cardData }) => {
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
                backgroundColor: getCardBackgroundColor(cardData),
                border: '0.2rem solid black',
                borderRadius: '0.8rem',
                clipPath: 'polygon(0 0 100% 100%, 100% 100%)'
            }} />
        </Box>
    );
};

export default BackFrame;
