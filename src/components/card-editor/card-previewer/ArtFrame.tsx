import React from 'react';
import Box from '@mui/material/Box';
import {getArtworkBorder} from "../../../types/color";

interface ArtFrameProps {
    imageUrl: string;
    scale: number;
}

const ArtFrame: React.FC<ArtFrameProps> = ({ imageUrl, scale }) => (
    <Box
        sx={{
            position: 'absolute',
            top: '42%',
            left: '50%',
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
            src={imageUrl}
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

export default ArtFrame;
