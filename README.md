# Setta frontend

## Getting started

### Environment variables

Copy the contents of `.env.example` to `.env` and fill in missing environment variables.

### Develop

```
npm install
npm run dev
```

### Linting

```
npm run lint:check
npm run lint:write (autofix)
```

### Formatting

```
npm run format:check
npm run format:write (autofix)
```

## Translations

We use [i80next](https://www.i18next.com/overview/getting-started) hooks for translations.

```tsx
function TranslatedComponent() {
  const { t } = useTranslation();

  return <div>{t('EXAMPLE')}</div>;
}
```

Translations need to be manually added/updated inside the `src/locales/<lang>.json` files. New languages need to be registered in `src/i18n.ts`.

## Production build

```
npm run build
```
