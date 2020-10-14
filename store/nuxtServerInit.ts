import { Context } from '@nuxt/types';
import { ApolloCurrentQueryResult } from 'apollo-client';

import { CurrentUserQuery } from '~/types/gql';
import CurrentUserQueryGQL from '~/graphql/queries/User/currentUser';

export default async function nuxtServerInit(_: any, { app }: Context) {
  const { data } = await app.apolloProvider?.defaultClient.query({
    query: CurrentUserQueryGQL,
    fetchPolicy: 'network-only',
  }) as ApolloCurrentQueryResult<CurrentUserQuery>;

  app.$accessor.currentUser.setCurrentUser(data?.currentUser);
}
