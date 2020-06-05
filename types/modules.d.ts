import { accessorType } from '~/store';
import { errorHandler } from '~/errorHandling/apollo/clientErrorHandler';

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
    $clientErrorHandler: typeof errorHandler;
    $emit<T, K extends keyof T>(event: K, args: T[K]): this;
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $accessor: typeof accessorType;
    $clientErrorHandler: typeof errorHandler;
    $emit<T, K extends keyof T>(event: K, args: T[K]): this;
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $clientErrorHandler: typeof errorHandler;
  }
}
interface NuxtExtendedWindow {
  onNuxtReady(obj: object): void
}
declare const window: NuxtExtendedWindow;
