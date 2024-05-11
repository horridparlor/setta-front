import Cookies from "js-cookie";

export enum AuthCookie {
    AUTH_TOKEN = 'authToken',
    FIRSTNAME = 'firstname',
    LASTNAME = 'lastname',
    USER_ID = 'userId',
}

export const getUserId = () => {
    return parseInt(Cookies.get(AuthCookie.USER_ID) || '');
}