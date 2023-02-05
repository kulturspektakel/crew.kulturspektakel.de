import { gql } from "@apollo/client";
import { Rate, theme } from "antd/es";
import { useBandApplicationRatingMutation, RatingFragment } from "./graphql";
import useViewerContext from "./useViewerContext";

gql`
  mutation BandApplicationRating($id: ID!, $rating: Int) {
    rateBandApplication(bandApplicationId: $id, rating: $rating) {
      id
      ...Rating
    }
  }
`;

export default function Rater({
  bandApplicationId,
  bandApplicationRating,
  value,
}: {
  bandApplicationId: string;
  bandApplicationRating: RatingFragment["bandApplicationRating"];
  value?: number;
}) {
  const [rate] = useBandApplicationRatingMutation();
  const viewer = useViewerContext();
  const { token } = theme.useToken();

  return (
    <Rate
      count={4}
      value={value}
      style={{ color: token.colorPrimary }}
      tooltips={[
        "Auf keinen Fall",
        "Eher nicht",
        "Eher schon",
        "Auf jeden Fall",
      ]}
      onChange={(rating) =>
        rate({
          variables: {
            id: bandApplicationId,
            rating: rating === 0 ? null : rating,
          },
          optimisticResponse: ({ id, rating }) => {
            let newRatings = [...bandApplicationRating];
            const idx = newRatings.findIndex((r) => r.viewer.id === viewer?.id);
            if (typeof rating !== "number") {
              newRatings.splice(idx, 1);
            } else if (idx === -1) {
              newRatings.push({
                __typename: "BandApplicationRating",
                rating,
                viewer: viewer!,
              });
            } else {
              newRatings[idx] = { ...newRatings[idx], rating };
            }

            return {
              rateBandApplication: {
                id,
                __typename: "BandApplication",
                rating:
                  newRatings.reduce((acc, cv) => acc + cv.rating, 0) /
                  newRatings.length,
                bandApplicationRating: newRatings,
              },
            };
          },
        })
      }
    />
  );
}
