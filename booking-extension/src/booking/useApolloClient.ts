import {useMemo} from 'react';
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import {withScalars} from 'apollo-link-scalars';
import {buildClientSchema, IntrospectionQuery} from 'graphql';
import {GraphQLDate, GraphQLDateTime} from 'graphql-scalars';
import introspectionResult from './types/graphql.schema.json';

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
          new HttpLink({
            uri: 'https://api.kulturspektakel.de/graphql',
            credentials: 'include',
            // headers: { cookie },
          }),
        ]),
        cache: new InMemoryCache(),
      }),
    [],
  );
  return client;
}
