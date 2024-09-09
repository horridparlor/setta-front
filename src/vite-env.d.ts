/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_DOMAIN: string;
  readonly VITE_REACT_APP_ASSET_DOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
