export const normalizeName = (name: string): string =>
    name.replace(/^({i}The)/i, '{i}')
        .replace(/{[^}]*}/g, '')
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s/g, '')
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '');

export const starsWithVowel = (message: string): boolean => {
    const vowels = 'aeiouAEIOU';
    return vowels.includes(message[0]);
};

export const replaceIfEmpty = (message: string, defaultTo: string) => {
    return message.length ? message : defaultTo;
}