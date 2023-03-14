import {useMemo, useState} from 'react';
import {ApolloProvider} from '@apollo/client';
import BandApplicationDetails from './BandApplicationDetails';
import useApolloClient from 'kulturspektakel-utils/src/useApolloClient';
import BookingTable from './BookingTable';
import {ConfigProvider, theme} from 'antd';
import deDE from 'antd/locale/de_DE';
import {ViewerContextProvider} from 'kulturspektakel-utils/src/useViewerContext';

export default function Booking() {
  const [selected, setSelected] = useState<string | null>(null);
  const client = useApolloClient();
  const customTheme = useMemo(
    () => ({
      token: {
        fontSizeHeading5: theme.defaultConfig.token.fontSize,
      },
    }),
    [],
  );

  console.log(client);

  return (
    <ApolloProvider client={client}>
      <ViewerContextProvider>
        <ConfigProvider locale={deDE} theme={customTheme}>
          <BookingTable onSelect={setSelected} />
          <BandApplicationDetails
            bandApplicationId={selected}
            onClose={() => setSelected(null)}
          />
        </ConfigProvider>
      </ViewerContextProvider>
    </ApolloProvider>
  );
}
