import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { AuthCookie } from './cookie';

export enum AdminEndpoint {
  CARD = 'card',
  COPY_CARD = 'copy-card',
  IMAGE = 'image',
}

export enum UserEndpoint {
  AUTHENTICATE = 'authenticate',
  CARDS = 'cards',
  CHANGE_PASSWORD = 'change-password',
  EXPANSIONS = 'expansions',
  USER = 'user',
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
  LEVEL_FRAME = 'icons/level-frame',
  SMALL_CARD_ART = 'small-art',
}

export const getAdminEndpoint = (endpoint: AdminEndpoint) => {
  return `${import.meta.env.VITE_REACT_APP_DOMAIN}api/admin/${endpoint}`;
};

export const getUserEndpoint = (endpoint: UserEndpoint) => {
  return `${import.meta.env.VITE_REACT_APP_DOMAIN}api/user/${endpoint}`;
};

export const getAsset = (
  endpoint: AssetEndpoint,
  filename: string | null = null
) => {
  return `${import.meta.env.VITE_REACT_APP_ASSET_DOMAIN}${endpoint}${filename ? '/' + filename : ''}${endpoint === AssetEndpoint.CARD_ART ? '' : '.webp'}`;
};

export const showError = (responseData: { [key: string]: string }) => {
  const errorMessage = 'Error: ' + responseData.error || 'Network error';
  toast.error(errorMessage);
};

export const getHeaders = () => {
  const authToken = Cookies.get(AuthCookie.AUTH_TOKEN);
  return {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };
};

export interface SystemUser {
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

const DEFAULT_SYSTEM_USER = {
  firstName: 'Nota',
  lastName: 'Uthenticated',
  isAdmin: false,
};

export const getUser = (): SystemUser => {
  const systemUserString: string | undefined = Cookies.get(
    AuthCookie.SYSTEM_USER
  );
  if (systemUserString === undefined) {
    return DEFAULT_SYSTEM_USER;
  }
  return JSON.parse(systemUserString);
};
