export enum AppPage {
  CardCatalogue = '/card-catalogue',
  CardEditor = '/card-editor',
  CardExpansions = '/card-expansions',
  ProcessManagement = '/process-management',
  UserManagement = '/user-management',
  UserRoles = '/user-roles',
  UserCreation = '/user-creation',
  UserProfile = '/user-profile',
  Error = '/error',
}

export const isAppPage = (value: string): value is AppPage => {
  return Object.values(AppPage).includes(value as AppPage);
};
