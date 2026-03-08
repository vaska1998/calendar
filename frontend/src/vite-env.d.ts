/// <reference types="vite/client" />

// Add explicit env types used by this project so `import.meta.env` is typed.
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_API_BASE_URL?: string;
  // add other VITE_... variables you use here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
