import React from 'react';
import { Typography } from '@mui/material';
import {CardType} from "../../../types/card";
import {CardEffectFrameColor} from "../../../types/color";

interface StatFrameProps {
    label: string;
    value: number;
    color: string;
}

const StatFrame: React.FC<StatFrameProps> = ({ label, value, color }) => (
    <Typography variant="h6" sx={{
        flex: 1,
        textAlign: 'center',
        backgroundColor: color,
        borderRadius: '4px',
        color: 'white',
        padding: '4px',
    }}>
        {label}: {value}
    </Typography>
);

export default StatFrame;
