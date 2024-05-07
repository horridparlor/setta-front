import React from 'react';
import {Typography} from '@mui/material';
import {CardData} from "../../../types/card";
import {getFontSize} from "../../../utils/fonts";
import {TextColor} from "../../../types/color";
import useExpansions from "../../../hooks/useExpansions";

interface CopyrightIndicatorProps {
    scale: number;
    cardData: CardData;
}

const CopyrightIndicator: React.FC<CopyrightIndicatorProps> = ({ scale, cardData }) => {
    const { expansions } = useExpansions();
    return (
        <Typography
            variant="h6"
            sx={{
                position: 'absolute',
                fontWeight: '300',
                right: `${2.5 * scale}rem`,
                top: `${40.2 * scale + (0.6 / scale)}rem`,
                fontSize: getFontSize(0, scale),
                color: TextColor.BLACK,
                opacity: 0.34,
                whiteSpace: 'nowrap',
            }}
        >
            {`©${expansions.find(expansion => expansion.id === cardData.expansionId)?.releaseYear} Eero Laine`}
        </Typography>
    );
};

export default CopyrightIndicator;
