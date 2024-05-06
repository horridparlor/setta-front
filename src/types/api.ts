export enum AdminEndpoint {
    CARD = 'card'
}

export enum UserEndpoint {
    CARDS = 'cards',
    EXPANSIONS = 'expansions'
}

export const getAdminEndpoint = (endpoint : AdminEndpoint) => {
    return `${process.env.REACT_APP_DOMAIN}api/admin/${endpoint}`
}

export const getUserEndpoint = (endpoint : UserEndpoint) => {
    return `${process.env.REACT_APP_DOMAIN}api/user/${endpoint}`
}
