import Cookies from "js-cookie";

export enum AuthCookie {
    AUTH_TOKEN = 'authToken',
    FIRSTNAME = 'firstname',
    LASTNAME = 'lastname',
    USER_ID = 'userId',
}

export enum CardCatalogueCookie {
    CARD_NAME = 'cardName',
    CARD_EFFECTS = 'cardEffects',
    REFERENCE_ID = 'referenceId',
    CARD_CLASS = 'cardClass',
    CARD_TYPE = 'cardType',
    CARD_SUBTYPE = 'cardSubtype',
    CARD_SUPERTYPE = 'cardSupertype',
    CARD_DECK = 'cardDeck',
    EXPANSION_ID = 'expansionId',
    SORT_ORDER = 'sortOrder',
    SORT_BY = 'sortBy',
    LEVEL = 'level',
    LEVEL_OPERATION = 'levelOperation',
    ATK = 'atk',
    ATK_OPERATION = 'atkOperation',
    DEF = 'def',
    DEF_OPERATION = 'defOperation',
    IS_ACE = 'isAce',
    OWNER_ID = 'ownerId',
    IS_RELEASED = 'isReleased',
    IS_ERRATA = 'isErrata',
}

export enum PageCookie {
    CARD_CATALOGUE_CARDS_SHOWN = 'cardsShown',
    CARD_CATALOGUE_FILTERS = 'cardCatalogueFilters'
}

export const getUserId = () => {
    return parseInt(Cookies.get(AuthCookie.USER_ID) || '');
}