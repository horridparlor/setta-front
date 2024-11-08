import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { AuthCookie } from './cookie';

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
  accessRights: AccessRights;
}

export type AccessRights = {
  isSuperAdmin?: boolean;
  canRelease?: boolean;
  canManageAdmins?: boolean;
  canManageUsers?: boolean;
  canClearContent?: boolean;
  hasUnlimitedTokens?: boolean;
  canShareTokens?: boolean;
  canMessageAdmins?: boolean;
  canMassExport?: boolean;
  canCreateContent?: boolean;
  canGenerateImages?: boolean;
  canMessage?: boolean;
  autoRefillTokens?: boolean;
  isRegularUser?: boolean;
  isPriorityUser?: boolean;
  isEmployee?: boolean;
  isContentCreator?: boolean;
};

const DEFAULT_SYSTEM_USER = {
  firstName: 'Nota',
  lastName: 'Uthenticated',
  accessRights: {},
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
