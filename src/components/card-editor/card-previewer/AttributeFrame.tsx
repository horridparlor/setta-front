import React from 'react';
import {Box, Typography} from '@mui/material';
import { CardData } from "../../../types/card";
import {getFontSize} from "../../../utils/fonts";

interface AttributeFrameProps {
    scale: number;
    cardData: CardData;
}

const AttributeFrame: React.FC<AttributeFrameProps> = ({ scale, cardData }) => {
    const ICON_SIZE = 6.8;

    return (
        <Box sx={{
            position: 'absolute',
            left: `${22.8 * scale}rem`,
            top: `${1.7 * scale}rem`,
        }}>
            <img
                src={'http://setta.fi/rush-api/assets/icons/attribute-frame.png'}
                alt="Attribute frame"
                style={{
                    width: `${ICON_SIZE * scale}rem`,
                    height: `${ICON_SIZE * scale}rem`,
                    position: 'absolute',
                    top: `${-0.25 * scale}rem`,
                }}
            />
            <img
                src={'http://setta.fi/rush-api/assets/icons/attribute/' + cardData.cardClass.toLowerCase() + '.png'}
                alt="Attribute icon"
                style={{
                    width: `${ICON_SIZE * scale}rem`,
                    height: `${ICON_SIZE * scale}rem`,
                    position: 'absolute',
                    top: `${-0.25 * scale}rem`,
                }}
            />
            <Typography
                variant="h6"
                sx={{
                    position: 'absolute',
                    fontWeight: '600',
                    left: `${3.75 * scale}rem`,
                    top: `${6.5 * scale}rem`,
                    fontSize: getFontSize(4, scale),
                    transform: 'translateX(-50%)',
                }}
            >
                {cardData.cardClass}
            </Typography>
        </Box>
    );
};

export default AttributeFrame;
