import { accessorType } from '~/store';
import { clientErrorHandler } from '~/plugins/apollo/clientErrorHandler';

declare interface ProcessEnv extends Record<string, string> {
  API_URL: string;
  CLIENT_URL: string;
  ENV: 'dev' | 'staging' | 'prod';
}

declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessorType;
    $clientErrorHandler: typeof clientErrorHandler;
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $accessor: typeof accessorType
    $clientErrorHandler: typeof clientErrorHandler;
  }
}

interface NuxtExtendedWindow {
  onNuxtReady(obj: object): void
}
declare const window: NuxtExtendedWindow;
