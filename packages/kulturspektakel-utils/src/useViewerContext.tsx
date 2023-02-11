import {gql} from '@apollo/client';
import React, {useContext} from 'react';
import {
  useViewerContextProviderQuery,
  ViewerContextProviderQuery,
} from '../graphql';

export const ViewerQ = gql`
  query ViewerContextProvider {
    viewer {
      id
      ...Avatar
    }
  }
`;

export type ViewerContextType = ViewerContextProviderQuery['viewer'];

const ViewerContext = React.createContext<ViewerContextType>(null);
export default function useViewerContext() {
  const viewer = useContext(ViewerContext);
  return viewer;
}

export function ViewerContextProvider(props: {children: React.ReactNode}) {
  const viewer = useViewerContextProviderQuery();

  return (
    <ViewerContext.Provider value={viewer?.data?.viewer}>
      {props.children}
    </ViewerContext.Provider>
  );
}
