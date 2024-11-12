import { components } from './schema';

export type User = components['schemas']['SystemUser'];

export type Role = components['schemas']['UserRole'];

export type TokenRequest = components['schemas']['UserTokenRequest'];

export type AccessRights = components['schemas']['AccessRights'];
