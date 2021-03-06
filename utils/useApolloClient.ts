import 'antd/dist/antd.css';
import {useMemo} from 'react';
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import {withScalars} from 'apollo-link-scalars';
import {buildClientSchema, IntrospectionQuery} from 'graphql';
import {GraphQLDate, GraphQLDateTime} from 'graphql-scalars';
import introspectionResult from '../types/graphql.schema.json';

export function initializeApolloClient(
  initialState: NormalizedCacheObject | null = null,
  cookie?: string,
) {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined', // set to true for SSR
    link: ApolloLink.from([
      withScalars({
        schema: buildClientSchema(
          (introspectionResult as unknown) as IntrospectionQuery,
        ),
        typesMap: {
          DateTime: GraphQLDateTime,
          Date: GraphQLDate,
        },
      }),
      new HttpLink({
        uri: 'https://api.kulturspektakel.de/graphql',
        credentials: 'include',
        headers: {cookie},
      }),
    ]),
    cache: new InMemoryCache().restore(initialState),
  });
}

function useApolloClient(
  initialState: NormalizedCacheObject | null = null,
  cookie?: string,
) {
  const store = useMemo(() => initializeApolloClient(initialState, cookie), []);
  return store;
}
export default useApolloClient;
