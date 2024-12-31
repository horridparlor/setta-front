import React from 'react';
import { Typography } from '@mui/material';
import { StatType } from '../../../types/card';
import { getStatBoxBackgroundColor, TextColor } from '../../../types/color';
import { getFontSize } from '../../../utils/fonts';

interface StatFrameProps {
  value: number;
  statType: StatType;
  scale: number;
}

const StatFrame: React.FC<StatFrameProps> = ({ value, statType, scale }) => (
  <>
    <Typography
      variant="h6"
      sx={{
        textAlign: 'center',
        backgroundColor: getStatBoxBackgroundColor(statType),
        borderRadius: `${0.8 * scale}rem`,
        color: TextColor.WHITE,
        padding: `${0.1 * scale}rem`,
        paddingTop: `${0.2 * scale}rem`,
        paddingBottom: `${0.2 * scale}rem`,
        fontSize: getFontSize(8, scale),
        fontWeight: '700',
        width: `${7.07 * scale}rem`,
        height: `${4.5 * scale}rem`,
        border: `solid ${0.2 * scale}rem black`,
      }}
    >
      {value}
    </Typography>
    <Typography
      sx={{
        textAlign: 'center',
        marginTop: `-${1.8 * scale}rem`,
        fontSize: 16 * scale,
        fontWeight: '600',
        opacity: 0.34,
        color: 'white',
      }}
    >
      {statType == StatType.ATTACK ? 'STR' : 'ASS'}
    </Typography>
  </>
);

export default StatFrame;
