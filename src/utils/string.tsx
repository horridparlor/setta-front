import {CardData, getMaximumExtension} from "../types/card";
import {MenuItem} from "@mui/material";

export const NONE_STRING = 'None';

export const normalizeName = (cardData: CardData|any): string => {
    if (typeof cardData === 'undefined') {
        return '';
    }
    const name = typeof cardData === 'string' ? cardData : cardData.cardName + getMaximumExtension(cardData);
    return name.replace(/^({i}The)/i, '{i}')
        .replace(/{[^}]*}/g, '')
        .replace(/[^a-zA-Z0-9\s-'!?–,:áäéö$[\]]/g, '');
};

export const serializeName = (cardData: CardData|any): string => {
    return normalizeName(cardData)
        .replace(/á|ä/g, 'a')
        .replace(/é|€/g, 'e')
        .replace(/ó|ö/g, 'ö')
        .replace(/ś|\$/g, 's')
        .replace(/-|'|!|\?|–|,|:|\[|\]/g, '')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace(/\s/g, '')
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '');
};

export const starsWithVowel = (message: string): boolean => {
    const vowels = 'aeiouAEIOU';
    return !!vowels.length && vowels.includes(message[0]);
};

export const replaceIfEmpty = (message: string|undefined, defaultTo: string) => {
    return message && message.length ? message : defaultTo;
}

export const encodeEffectsString = (message: string) => {
    const tagPattern = /(\{[isb]*\}.*?\{\/[isb]*\})|(\b(normal|revenge|royal|fusion|killer move|domain|time traveller|pendulum|hand trap|maximum|defense|attack|face-up|face-down|extra|main|piercing|incineration|chain-attack|triple-attack|sleeptalk|armor-up|life-gain|goaded|ruler|parasite|host|except|\d+|(?<=or\s+)lower|(?<=or\s+)higher|(?<=and\s+)lower|(?<=and\s+)higher|(?<=or\s+)less|(?<=and\s+)less|(?<=You can\s+)set|(?<=Opponent can\s+)set|(?<=your\s+)set|(?<=opponent's\s+)set|(?<=equal to its\s+)level|(?<=When it is\s+)destroyed|(?<=you\s+)may|(?<=opponent\s+)may|(?<=If\s+)set|(?<=copies of the\s+)same|(?<=times the\s+)lower|(?<=times the\s+)higher|(?<=of the\s+)levels|this(?=\s+turn)|End(?=\s+of turn)|double(?=\s+the)|set(?=\s+monster)|set(?=\s+monsters)|cannot(?=\s+be)|don't(?=\s+have)|(?<=with\s+)same(?=\s+level)|(?<=as\s+)discarded(?=\s+card))\b)|(\b(Spell|Spells|Trap|Traps|atk|def|Abyss|Dragon|Dragons|Kawaii|Slime|Slimes|Sparks|Zombie|Zombies|cannot|listing|can|everytime|anytime)\b)/g;
    return message
        .replace('(', '{i}')
        .replace('.)', ')')
        .replace(')', '{/i}')
        .replace(tagPattern, (match, p1, p2, p3, p4) => {
        if (p1) return p1;
        if (p3) return `{sb}${match}{/sb}`;
        if (p4) return `{b}${match}{/b}`;
        return match;
    })
        .replace('{/sb} {sb}normal{/sb} {b}', '{/sb} normal {b}')
        .replace('/i}{sb}', '/i}')
        .replace('/i}{b}', '/i}')
        ;
}

export const endsSentence = (message: String) => {
    if (!message.length) {
        return false;
    }
    const lastChar = message.charAt(message.length - 1);
    return ['.', '!', '?'].includes(lastChar);
}

export const getStringSelector = (values: Array<string>, defaultTo: string|undefined = undefined) => {
    const sorted = defaultTo === undefined ? values : values.sort();
    return [<MenuItem key='none' value={defaultTo ?? NONE_STRING}>{defaultTo === undefined ? NONE_STRING : '–'}</MenuItem>,
        sorted.filter(value => !!defaultTo || value !== 'None').map(value => (
            <MenuItem key={value} value={value}>{value}</MenuItem>
        ))
    ];
}

export const isString = (value: any): value is string => {
    return typeof value === 'string';
}

export const isNoneString = (message: string) => {
    return message === '' || message === NONE_STRING;
}