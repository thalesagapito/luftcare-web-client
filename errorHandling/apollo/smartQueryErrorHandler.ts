import { NuxtAppOptions } from '@nuxt/types';
import { ApolloError } from 'apollo-client';

export default function smartQueryErrorHandler(error: ApolloError, vm: NuxtAppOptions) {
  const { _isMounted: isClient } = vm;

  if (isClient) {
    vm.$clientErrorHandler(error);
  }
}
