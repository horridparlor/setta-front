import React from 'react';
import { Box } from '@mui/material';
import {CardData, CardSubtype, CardType} from "../../../types/card";
import { getArtworkBorder, getCardBackgroundColor } from "../../../types/color";

interface AttributeCutProps {
    scale: number;
    cardData: CardData;
}

const AttributeCut: React.FC<AttributeCutProps> = ({ scale, cardData }) => {
    const PANEL_SIZE = 4.8;
    const cutPanelStyle = {
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${PANEL_SIZE * scale}rem`,
        height: `${PANEL_SIZE * scale}rem`,
        backgroundColor: 'transparent',
        padding: `${0.8 * scale}rem ${0.6 * scale}rem`,
    }

    return (
        <>
            <Box sx={{
                top: `${5.15 * scale}rem`,
                left: `${23.35 * scale}rem`,
                borderBottom: getArtworkBorder(scale),
                ...cutPanelStyle
            }}>
            </Box>
            <Box sx={{
                top: `${4.3 * scale}rem`,
                left: `${21.85 * scale}rem`,
                transform: `rotate(-22.5deg)`,
                borderLeft: getArtworkBorder(scale),
                ...cutPanelStyle
            }}>
            </Box>
        </>
    );
};

export default AttributeCut;
