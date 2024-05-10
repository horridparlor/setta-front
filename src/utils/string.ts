import {CardData, getMaximumExtension} from "../types/card";

export const normalizeName = (cardData: CardData|any): string => {
    if (typeof cardData === 'undefined') {
        return '';
    }
    const name = typeof cardData === 'string' ? cardData : cardData.cardName + getMaximumExtension(cardData);
    return name.replace(/^({i}The)/i, '{i}')
        .replace(/{[^}]*}/g, '')
        .replace(/[^a-zA-Z0-9\s-'!?áäéö$[\]]/g, '');
};

export const serializeName = (cardData: CardData|any): string => {
    return normalizeName(cardData)
        .replace(/á|ä/g, 'a')
        .replace(/é|€/g, 'e')
        .replace(/ó|ö/g, 'ö')
        .replace(/ś|\$/g, 's')
        .replace(/-|'|!|\?|\[|\]/g, '')
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