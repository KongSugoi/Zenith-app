/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // Thêm các env variables khác nếu cần
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Capacitor types
declare module '@capacitor/core' {
  interface PluginRegistry {
    [pluginName: string]: any
  }
}

// React types enhancement for Capacitor
declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform(): boolean
      getPlatform(): string
    }
  }
}