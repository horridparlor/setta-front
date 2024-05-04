export const normalizeName = (name: string): string =>
    name.replace(/{[^}]*}/g, '')
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s/g, '')
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '');