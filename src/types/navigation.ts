export enum AppPage {
  CardCatalogue = '/card-catalogue',
  CardEditor = '/card-editor',
  CardExpansions = '/card-expansions',
  UserRoles = '/user-roles',
  Error = '/error',
}

export const isAppPage = (value: string): value is AppPage => {
  return Object.values(AppPage).includes(value as AppPage);
};
