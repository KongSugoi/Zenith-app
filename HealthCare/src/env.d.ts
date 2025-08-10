/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
  // thêm biến môi trường khác nếu có
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}