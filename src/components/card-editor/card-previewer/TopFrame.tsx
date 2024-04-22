import React from 'react';
import { Typography } from '@mui/material';

interface TopFrameProps {
    name: string;
    scale: number;
}

const TopFrame: React.FC<TopFrameProps> = ({ name, scale }) => (
    <Typography variant="h5" component="h1" sx={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 'bold',
        fontSize: `${2.3 * scale}rem`,
        textAlign: 'left',
        backgroundColor: 'transparent',
        borderRadius: '1rem',
        position: 'absolute',
        top: `${1.8 * scale}rem`,
        left: `${1.8 * scale}rem`,
        zIndex: 1000,
    }}>
        {name}
    </Typography>
);

export default TopFrame;
