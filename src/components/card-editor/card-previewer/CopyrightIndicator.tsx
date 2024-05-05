import React from 'react';
import {Box, Typography} from '@mui/material';
import {CardData, CardType} from "../../../types/card";
import {getFontSize} from "../../../utils/fonts";
import {getFrameTextColor, TextColor} from "../../../types/color";

interface CopyrightIndicatorProps {
    scale: number;
    cardData: CardData;
}

const CopyrightIndicator: React.FC<CopyrightIndicatorProps> = ({ scale, cardData }) => {
    return (
        <Typography
            variant="h6"
            sx={{
                position: 'absolute',
                fontWeight: '300',
                right: `${2.5 * scale}rem`,
                top: `${40.8 * scale}rem`,
                fontSize: getFontSize(0, scale),
                color: TextColor.BLACK,
                opacity: 0.34
            }}
        >
            {'©2024 Eero Laine'}
        </Typography>
    );
};

export default CopyrightIndicator;
