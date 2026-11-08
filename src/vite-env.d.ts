/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_OPENRM_ORGANIZATION_ID?: string;
  readonly VITE_OPENRM_PROJECT_ID?: string;
  readonly VITE_OPENRM_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

