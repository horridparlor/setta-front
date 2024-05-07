export enum AdminEndpoint {
    CARD = 'card'
}

export enum UserEndpoint {
    CARDS = 'cards',
    EXPANSIONS = 'expansions'
}

export enum RequestMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export enum AssetEndpoint {
    ATTRIBUTE_FRAME = 'icons/attribute',
    CARD_ART = 'card-art',
    LEVEL_FRAME = 'icons/level-frame'
}

export const getAdminEndpoint = (endpoint : AdminEndpoint) => {
    return `${process.env.REACT_APP_DOMAIN}api/admin/${endpoint}`
}

export const getUserEndpoint = (endpoint : UserEndpoint) => {
    return `${process.env.REACT_APP_DOMAIN}api/user/${endpoint}`
}

export const getAsset = (endpoint: AssetEndpoint, filename: string|null = null) => {
    return `${process.env.REACT_APP_ASSET_DOMAIN}${endpoint}${filename ? '/' + filename : ''}.png`;
}