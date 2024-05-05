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
    const getArtScale = () => {
        return 1 + cardData.artScale / 32;
    }

    return (
        <Box
            sx={{
                position: 'absolute',
                top: `${42}%`,
                left: `${50}%`,
                width: `${27 * scale}rem`,
                height: `${24 * scale}rem`,
                marginTop: `-${13 * scale}rem`,
                marginLeft: `-${13.6 * scale}rem`,
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
                    width: `${100 * getArtScale()}%`,
                    height: `${110 * getArtScale()}%`,
                    objectFit: 'cover',
                    objectPosition: `${-4 * cardData.artXOffset}px ${-4 * cardData.artYOffset}px`
                }}
            />
        </Box>
    );
};

export default ArtFrame;