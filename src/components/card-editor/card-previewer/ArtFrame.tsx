import React from 'react';
import Box from '@mui/material/Box';
import { getArtworkBorder } from "../../../types/color";
import { CardData } from "../../../types/card";
import { normalizeName } from "../../../utils/string";

interface ArtFrameProps {
    cardData: CardData;
    scale: number;
}

const ArtFrame: React.FC<ArtFrameProps> = ({ cardData, scale }) => {
    const getImageUrl = () => {
        return 'https://setta.fi/rush-api/assets/card-art/' + normalizeName(cardData.cardName) + '.png';
    };

    return (
        <Box
            sx={{
                position: 'absolute',
                top: `${42}%`,
                left: `${50}%`,
                width: `${27 * cardData.artScale * scale}rem`,
                height: `${24 * cardData.artScale * scale}rem`,
                marginTop: `-${(13 + cardData.artYOffset) * scale}rem`,
                marginLeft: `-${(13.6 + cardData.artXOffset) * scale}rem`,
                border: getArtworkBorder(scale),
                overflow: 'hidden',
                transform: 'none',
            }}
        >
            <Box
                component="img"
                src={getImageUrl()}
                alt="Card art"
                sx={{
                    width: '100%',
                    height: '110%',
                    objectFit: 'cover',
                    objectPosition: 'top'
                }}
            />
        </Box>
    );
};

export default ArtFrame;