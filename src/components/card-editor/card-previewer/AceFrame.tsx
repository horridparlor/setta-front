import React from 'react';
import {Box, Typography} from '@mui/material';
import {CardData} from "../../../types/card";
import {getFontSize} from "../../../utils/fonts";

interface AceFrameProps {
    scale: number;
    cardData: CardData;
}

const AceFrame: React.FC<AceFrameProps> = ({ scale, cardData }) => {
    return (
        <>
            <Box sx={{
                display: cardData.isAce ? 'flex' : 'none',
                top: `${6.8 * scale}rem`,
                left: `${3 * scale}rem`,
                border: `solid ${0.27 * scale}rem black`,
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
                width: `${5.8 * scale}rem`,
                height: `${2.2 * scale}rem`,
                backgroundColor: '#f2ef37',
                borderRadius: `${0.8 * scale}rem`,
                padding: `${0.9 * scale}rem ${0.55 * scale}rem`,
            }}>
                <Typography sx={{
                    fontWeight: '700',
                    fontSize: getFontSize(9, scale),
                }}>
                    ACE
                </Typography>
            </Box>
        </>
    );
};

export default AceFrame;
