import {Avatar, Table, theme, Tooltip, Typography} from 'antd';
import React, {useMemo} from 'react';
import {gql} from '@apollo/client';
import {
  BandApplcationsQuery,
  useBandApplcationsQuery,
} from 'kulturspektakel-utils/graphql';
import Rater from './Rater';
import AutoSizer from 'react-virtualized-auto-sizer';
import useViewerContext from 'kulturspektakel-utils/src/useViewerContext';
import Rating from './Rating';
import {CommentOutlined} from '@ant-design/icons';
import {GENRE_CATEGORIES, GENRE_ICONS} from './genre';
import QuickType from './QuickType';

gql`
  fragment Rating on BandApplication {
    bandApplicationRating {
      viewer {
        id
        displayName
        profilePicture
      }
      rating
    }
    rating
  }
  query BandApplcations($id: ID!) {
    viewer {
      id
    }
    node(id: $id) {
      ... on Event {
        bandApplication {
          id
          bandname
          rating
          city
          genre
          genreCategory
          distance
          comments {
            totalCount
          }
          ...ContactedBy
          ...Rating
        }
      }
    }
  }
`;

type RecordType = Extract<
  BandApplcationsQuery['node'],
  {__typename?: 'Event'}
>['bandApplication'][number];

gql`
  fragment Rating on BandApplication {
    bandApplicationRating {
      viewer {
        id
        displayName
        profilePicture
      }
      rating
    }
    rating
  }
  query BandApplcations($id: ID!) {
    viewer {
      id
    }
    node(id: $id) {
      ... on Event {
        bandApplication {
          id
          bandname
          rating
          city
          genre
          genreCategory
          distance
          comments {
            totalCount
          }
          ...ContactedBy
          ...Rating
        }
      }
    }
  }
`;

export default function BookingTable(props: {onSelect: (id: string) => void}) {
  const {data, loading} = useBandApplcationsQuery({
    variables: {
      id: `Event:${new URL(document.location.toString()).searchParams.get(
        'eventId',
      )}`,
    },
  });

  const dataSource =
    data?.node?.__typename === 'Event' ? data.node.bandApplication : [];

  return (
    <div style={{height: '100vh'}}>
      <QuickType data={dataSource} onSelect={props.onSelect} />
      <AutoSizer>
        {({width, height = 0}) => (
          <div style={{height, width}}>
            <MemoizedTable
              loading={loading}
              height={height - 40}
              dataSource={dataSource}
              setSelected={props.onSelect}
            />
          </div>
        )}
      </AutoSizer>
    </div>
  );
}

const MemoizedTable = React.memo(
  ({
    setSelected,
    loading,
    dataSource,
    height,
  }: {
    dataSource: RecordType[];
    loading: boolean;
    setSelected: (id: string) => void;
    height: number;
  }) => {
    const viewer = useViewerContext();
    const {token} = theme.useToken();
    const ids = useMemo(
      () =>
        dataSource?.reduce(
          (acc, cv, i) => acc.set(cv.id, i + 1),
          new Map<string, number>(),
        ) ?? new Map(),
      [dataSource],
    );

    return (
      <Table<RecordType>
        loading={loading}
        pagination={false}
        onRow={(r) => ({
          onClick: (e) =>
            !new Set(['path', 'input']).has(
              (e.target as any).tagName.toLowerCase(),
            ) && setSelected(r.id),
        })}
        scroll={{y: height}}
        size="small"
        columns={[
          {
            key: 'index',
            title: '',
            dataIndex: 'id',
            align: 'center',
            width: 50,
            render: (id) => ids.get(id),
          },
          {
            key: 'genreCategory',
            title: '',
            width: 50,
            dataIndex: 'genreCategory',
            filterMultiple: true,
            filters: Array.from(GENRE_CATEGORIES.entries()).map(
              ([value, text]) => ({text, value}),
            ),
            onFilter: (value, {genreCategory}) => value === genreCategory,
            render: (_, {genreCategory}) => (
              <Tooltip
                title={GENRE_CATEGORIES.get(genreCategory)}
                placement="topRight"
              >
                <img
                  src={GENRE_ICONS.get(genreCategory)}
                  width="32px"
                  height="32px"
                  alt="Genre"
                />
              </Tooltip>
            ),
          },
          {
            key: 'bandname',
            title: 'Name',
            dataIndex: 'bandname',
            render: (_, {bandname, genre}) => (
              <>
                <Typography.Text strong ellipsis>
                  {bandname}
                </Typography.Text>
                {genre && (
                  <>
                    <br />
                    <Typography.Text ellipsis>{genre}</Typography.Text>
                  </>
                )}
              </>
            ),
          },
          {
            key: 'city',
            title: 'Ort',
            dataIndex: 'city',
            sorter: (a, b) => (a.distance ?? 0) - (b.distance ?? 0),
            render: (_, {city, distance}) => (
              <>
                {city}
                {distance && (
                  <>
                    <br />
                    <Typography.Text type="secondary">
                      {distance.toFixed()}&thinsp;km
                    </Typography.Text>
                  </>
                )}
              </>
            ),
          },
          {
            key: 'rating',
            title: 'Bewertung',
            width: 150,
            dataIndex: 'rating',
            sorter: (a, b) => (a.rating ?? 0) - (b.rating ?? 0),
            align: 'right',
            render: (_, {rating, bandApplicationRating}) =>
              rating ? (
                <Rating
                  rating={rating}
                  bandApplicationRating={bandApplicationRating}
                />
              ) : null,
          },
          {
            key: 'rater',
            title: '',
            dataIndex: 'rating',
            width: 150,
            render: (_, {id, bandApplicationRating}) => (
              <Rater
                bandApplicationRating={bandApplicationRating}
                bandApplicationId={id}
                value={
                  bandApplicationRating.find(
                    ({viewer: {id}}) => id === viewer?.id,
                  )?.rating
                }
              />
            ),
          },
          {
            key: 'avatars',
            title: '',
            dataIndex: 'rating',
            width: 150,
            render: (_, {bandApplicationRating}) => (
              <Avatar.Group>
                {bandApplicationRating.map((r) => (
                  <Tooltip
                    key={r.viewer.id}
                    title={r.viewer.displayName}
                    placement="topLeft"
                  >
                    <Avatar src={r.viewer.profilePicture} size="small" />
                  </Tooltip>
                ))}
              </Avatar.Group>
            ),
          },
          {
            key: 'comments',
            dataIndex: 'comments',
            width: 50,
            render: (_, {comments}) =>
              comments.totalCount > 0 ? (
                <Tooltip
                  title={`${comments.totalCount} Kommentar${
                    comments.totalCount !== 1 ? 'e' : ''
                  }`}
                  placement="left"
                >
                  <CommentOutlined
                    style={{fontSize: 20, color: token.colorPrimary}}
                  />
                </Tooltip>
              ) : null,
          },
        ]}
        dataSource={dataSource}
        rowKey="id"
      />
    );
  },
);
