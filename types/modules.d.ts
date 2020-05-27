import { accessorType } from '~/store';

declare interface ProcessEnv extends Record<string, string> {
  API_URL: string;
  CLIENT_URL: string;
  CLIENT_DEV_HOST: string;
  CLIENT_DEV_PORT: string;
  ENV: 'dev' | 'staging' | 'prod';
}

declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessorType;
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $accessor: typeof accessorType;
  }
}

interface NuxtExtendedWindow {
  onNuxtReady(obj: object): void
}
declare const window: NuxtExtendedWindow;
