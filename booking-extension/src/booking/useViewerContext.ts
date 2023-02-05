import { gql } from "@apollo/client";
import React, { useContext } from "react";
import { ViewerContextProviderQuery } from "./graphql";

export const ViewerQ = gql`
  query ViewerContextProvider {
    viewer {
      id
      ...Avatar
    }
  }
`;

export type ViewerContextType = ViewerContextProviderQuery["viewer"];

export const ViewerContext = React.createContext<ViewerContextType>(null);
export default function useViewerContext() {
  const viewer = useContext(ViewerContext);
  return viewer;
}
