import React from 'react';
import {Box, Typography} from '@mui/material';
import {getFontSize} from "../../../utils/fonts";
import {AssetEndpoint, getAsset} from "../../../types/api";

interface LevelFrameProps {
    level: number;
    scale: number;
}

const LevelFrame: React.FC<LevelFrameProps> = ({ level, scale }) => {
    const STAR_SIZE = 7.4;

    return (
        <Box sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: `${STAR_SIZE * scale}rem`,
            height: `${STAR_SIZE * scale}rem`,
            left: `${0.4 * scale}rem`,
            top: `${-1.3 * scale}rem`,
        }}>
            <img
                src={getAsset(AssetEndpoint.LEVEL_FRAME)}
                alt="Level icon"
                style={{
                    width: `${STAR_SIZE * scale}rem`,
                    height: `${STAR_SIZE * scale}rem`,
                    position: 'absolute',
                    top: `${-0.2 * scale}rem`,
                }}
            />
            <Typography
                variant="h6"
                sx={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontWeight: '700',
                    fontSize: getFontSize(10, scale)
                }}
            >
                {level}
            </Typography>
        </Box>
    );
};

export default LevelFrame;
