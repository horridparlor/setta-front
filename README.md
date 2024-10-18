# Setta frontend

## Getting started

### Environment variables

Copy the contents of `.env.example` to `.env` and fill in missing environment variables.

### VSCode extensions

TSP for API docs
https://marketplace.visualstudio.com/items?itemName=typespec.typespec-vscode

Prettier for formatting
https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

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

### E2E Tests

```
npm run test:playwright
npm run test:playwright:report (view test result report)
```

## API CLIENT

We use [TypeSpec](https://typespec.io/docs) as a tool to generate openapi docs. We also generate a typesafe api client from the openapi docs using [openapi-typescript](https://openapi-ts.dev/introduction) and [openapi-fetch](https://openapi-ts.dev/openapi-fetch/).

### Updates

1. Run `npm install` inside `./api`.
2. Update api definitions inside `./api/main.tsp`.
3. Run `npm run api:generate` to generate the openapi schema and api client.

### Files

Generated openapi schema is found at `./api/tsp-output/@typespec/openapi3/openapi.yaml`.

Generated typesafe api client is found at `./src/api/client.ts`.

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
