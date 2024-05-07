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

export const getAdminEndpoint = (endpoint : AdminEndpoint) => {
    return `${process.env.REACT_APP_DOMAIN}api/admin/${endpoint}`
}

export const getUserEndpoint = (endpoint : UserEndpoint) => {
    return `${process.env.REACT_APP_DOMAIN}api/user/${endpoint}`
}
