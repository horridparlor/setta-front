import React from 'react';
import {Box} from '@mui/material';
import {CardData, CardSubtype, CardType} from "../../../types/card";
import {CardMainFrameColor, getCardBackground, getCardBackgroundColor} from "../../../types/color";

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
            padding: '0.8rem 0.6rem',
        }}>
            <Box sx={{
                position: 'absolute',
                width: '94%',
                height: '95.5%',
                backgroundColor: getCardBackgroundColor(cardData),
                background: getCardBackground(cardData),
                border: '0.2rem solid black',
                borderRadius: '0.8rem',
                clipPath: "polygon(" +
                    "0% 0%, " +
                    "100% 0%, " +
                    "100% 100%, " +
                    "4% 100%, " +
                    "4% 68.3%, " +
                    "96.3% 68.3%, " +
                    "96.3% 25.3%, " +
                    "76.2% 25.3%, " +
                    "67.9% 11.3%, " +
                    "4% 11.3%, " +
                    "4% 68.3%, " +
                    "4% 100%, " +
                    "0% 100%" +
                ")"
            }} />
        </Box>
    );
};

export default BackFrame;
