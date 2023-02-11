import {useMemo} from 'react';
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {withScalars} from 'apollo-link-scalars';
import {buildClientSchema, IntrospectionQuery} from 'graphql';
import {GraphQLDate, GraphQLDateTime} from 'graphql-scalars';
import introspectionResult from '../graphql.schema.json';
import jwtDecode from 'jwt-decode';

let token: string | undefined = undefined;
// prevent multiple  refresh operations to run in parallel
let refresher: Promise<{data?: {access_token: string}}> | null = null;

const authMiddleware = setContext(async () => {
  if (
    token == null ||
    jwtDecode<{exp: number}>(token).exp < new Date().getTime() / 1000
  ) {
    // in dev mode, CMS is not running, so we are calling the production CMS
    if (!refresher) {
      refresher = fetch(
        (import.meta.env.DEV ? 'https://cms.kulturspektakel.de' : '') +
          '/auth/refresh',
        {
          method: 'POST',
          credentials: 'include',
        },
      ).then((res) => res.json());
    }

    const res = await refresher;
    refresher = null;
    token = res.data?.access_token;
  }

  return {
    headers:
      token != null
        ? {
            authorization: `Bearer ${token}`,
          }
        : undefined,
  };
});

export default function useApolloClient() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const client = useMemo(
    () =>
      new ApolloClient({
        link: ApolloLink.from([
          withScalars({
            schema: buildClientSchema(
              introspectionResult as unknown as IntrospectionQuery,
            ),
            typesMap: {
              DateTime: GraphQLDateTime,
              Date: GraphQLDate,
            },
          }),
          authMiddleware,
          new HttpLink({
            uri: 'https://api.kulturspektakel.de/graphql',
            credentials: 'include',
          }),
        ]),
        cache: new InMemoryCache(),
      }),
    [],
  );
  return client;
}
