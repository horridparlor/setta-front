import React from 'react';
import { Typography } from '@mui/material';

interface EffectsFrameProps {
    text: string;
}

const EffectsFrame: React.FC<EffectsFrameProps> = ({ text }) => (
    <Typography variant="subtitle1" sx={{
        textAlign: 'center',
        padding: '8px',
        backgroundColor: 'rgba(255, 165, 0, 0.8)',
        borderRadius: '4px',
        minHeight: '48px',
        overflow: 'hidden',
    }}>
        {text}
    </Typography>
);

export default EffectsFrame;
