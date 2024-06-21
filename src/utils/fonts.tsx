import { styled } from "@mui/material/styles";
import React from "react";

export enum FontSize {
    NAME = 56
}

const FONT_SIZES: {[key: number]: number} = {
    0: 30,
    1: 34,
    2: 38,
    3: 42,
    4: 46,

    5: 52,
    6: 56,
    7: 60,
    8: 64,
    9: 68,
    10: 80
}

const FONT_SCALE_MULTIPLIER = 0.038;

const getSizeByIndex = (index: number) => {
    if (index > Object.values(FONT_SIZES).length) {
        return index;
    }
    return FONT_SIZES.hasOwnProperty(index) ? FONT_SIZES[index] : FONT_SIZES[4];
}

export const getFontSize = (index: number, scale: number) => {
    const fontSize = getSizeByIndex(index);
    return `${fontSize * scale * FONT_SCALE_MULTIPLIER}rem`;
}

const createStyledSpan = (styleProps: { fontWeight: string, fontStyle?: string }) => styled('span')<{ fontSize?: number, scale: number }>((props) => ({
    fontWeight: styleProps.fontWeight,
    fontStyle: styleProps.fontStyle,
    fontSize: props.fontSize ? getFontSize(props.fontSize, props.scale) : undefined
}));

export function addSizeToRichText(richText: string|number, fontSize: number): string {
    const regex = /\{([a-zA-Z]+)\}/g;
    if (typeof richText === 'number') {
        richText = richText.toString();
    }
    return richText
        .replace('{i}', ' {i}(')
        .replace('{/i}', '.){/i}')
        .replace(regex, `{$1=${fontSize}}`);
}

const HeavyNormal = createStyledSpan({ fontWeight: '700' });
const BoldNormal = createStyledSpan({ fontWeight: '600' });
const BoldItalic = createStyledSpan({ fontWeight: '600', fontStyle: 'italic' });
const SemiBoldNormal = createStyledSpan({ fontWeight: '500' });
const RegularNormal = createStyledSpan({ fontWeight: '400' });
const LightItalic = createStyledSpan({ fontWeight: '300', fontStyle: 'italic' });

export const formatText = (text: string, scale: number): JSX.Element[] => {
    const regex = /\{(h|b|bi|sb|r|i|bs)=?(\d+)?\}(.*?)\{\/(h|b|bi|sb|r|i|bs)\}/g;
    let result: JSX.Element[] = [];
    let lastEnd = 0;

    text.replace(regex, (match, tag, fontSize, content, _, offset) => {
        const index = parseInt(fontSize);
        const size = getSizeByIndex(index);
        if (offset > lastEnd) {
            result.push(<span key={lastEnd}>{text.slice(lastEnd, offset)}</span>);
        }

        const elementProps = { key: offset, fontSize: size, scale };
        switch (tag) {
            case 'h':
                result.push(<HeavyNormal {...elementProps}>{content}</HeavyNormal>);
                break;
            case 'b':
                result.push(<BoldNormal {...elementProps}>{content}</BoldNormal>);
                break;
            case 'bi':
                result.push(<BoldItalic {...elementProps}>{content}</BoldItalic>);
                break;
            case 'sb':
                result.push(<SemiBoldNormal {...elementProps}>{content}</SemiBoldNormal>);
                break;
            case 'r':
                result.push(<RegularNormal {...elementProps}>{content}</RegularNormal>);
                break;
            case 'i':
                result.push(<LightItalic {...elementProps}>{content}</LightItalic>);
                break;
            case 'bs':
                result.push(<BoldItalic sx={{ textDecoration: 'line-through' }} {...elementProps}>{content}</BoldItalic>);
                break;
        }
        lastEnd = offset + match.length;
        return match;
    });

    if (lastEnd < text.length) {
        result.push(<span key={lastEnd}>{text.slice(lastEnd)}</span>);
    }

    return result;
};
