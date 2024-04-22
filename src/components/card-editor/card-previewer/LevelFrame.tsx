import React from 'react';
import { Typography } from '@mui/material';

interface LevelFrameProps {
    level: number;
}

const LevelFrame: React.FC<LevelFrameProps> = ({ level }) => (
    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
        <img src={'http://setta.fi/rush-api/assets/icons/level-frame.png'} alt="Level icon" style={{ width: 24, height: 24 }} />
        {level}
    </Typography>
);

export default LevelFrame;
