import React from 'react';
import { Typography } from '@mui/material';
import {formatText, getFontSize} from "../../../utils/fonts";

interface TopFrameProps {
    name: string;
    scale: number;
}

const NameFrame: React.FC<TopFrameProps> = ({ name, scale }) => (
    <Typography variant="h5" component="h1" sx={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: '600',
        fontSize: getFontSize(8, scale),
        textAlign: 'left',
        backgroundColor: 'transparent',
        borderRadius: '1rem',
        position: 'absolute',
        top: `${1.6 * scale}rem`,
        left: `${1.9 * scale}rem`,
        zIndex: 1000,
    }}>
        {formatText(name, scale)}
    </Typography>
);

export default NameFrame;
