export const normalizeName = (name: any): string => {
    if (typeof name !== 'string') {
        return '';
    }
    return name.replace(/^({i}The)/i, '{i}')
        .replace(/{[^}]*}/g, '')
        .replace(/[^a-zA-Z0-9\s]/g, '')
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