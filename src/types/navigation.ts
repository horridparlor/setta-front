export enum AppPage {
  CardCatalogue = '/card-catalogue',
  CardEditor = '/card-editor',
<<<<<<< HEAD
  UserManagement = '/user-management'
=======
  CardExpansions = '/card-expansions',
  Error = '/error'
>>>>>>> 8eeaa74adf4fc7105f01400254240eb259a79ca5
}

export const isAppPage = (value: string): value is AppPage => {
  return Object.values(AppPage).includes(value as AppPage);
};
