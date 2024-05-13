import React from 'react';
import Box from '@mui/material/Box';
import {getArtworkBorder} from "../../../types/color";
import {CardData, getOwnerId} from "../../../types/card";
import {normalizeName, serializeName} from "../../../utils/string";
import {AssetEndpoint, getAsset} from "../../../types/api";
import Cookies from "js-cookie";
import {AuthCookie} from "../../../types/cookie";

interface ArtFrameProps {
    cardData: CardData;
    scale: number;
    overwriteArt?: File;
    oldName?: string;
}

const ArtFrame: React.FC<ArtFrameProps> = ({ cardData, scale, overwriteArt, oldName }) => {
    const getImageUrl = () => {
        if (overwriteArt) {
            return URL.createObjectURL(overwriteArt);
        }
        return getAsset(scale === 1 ? AssetEndpoint.CARD_ART : AssetEndpoint.SMALL_CARD_ART,
            + cardData.cardId + '/' + getOwnerId(cardData) + '/'  + (oldName ? serializeName(oldName) : serializeName(cardData)));
    };
    const getArtScale = () => {
        return scale === 1 ?  1 + cardData.artScale / 32 : 1;
    }

    const getOffsetPixelScale = () => {
        return scale === 1 ? -0.25 : 0;
    }

    return (
        <Box
            sx={{
                position: 'absolute',
                top: `${18.4 * scale + 0.25 / scale}rem`,
                left: `${15.35 * scale + 0.2 / scale}rem`,
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
                    width: `${26.95 * getArtScale() * scale}rem`,
                    height: `${24 * getArtScale() * scale}rem`,
                    objectFit: 'cover',
                    objectPosition: `${getOffsetPixelScale() * cardData.artXOffset * scale}rem ${getOffsetPixelScale() * cardData.artYOffset * scale}rem`
                }}
            />
        </Box>
    );
};

export default ArtFrame;