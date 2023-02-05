import {useState} from 'react';
import {ApolloProvider} from '@apollo/client';
import BandApplicationDetails from './BandApplicationDetails';
import useApolloClient from './useApolloClient';
import BookingTable from './BookingTable';
import {ConfigProvider, theme} from 'antd/es';
import deDE from 'antd/locale/de_DE';

export default function Booking() {
  const [selected, setSelected] = useState<string | null>(null);
  const client = useApolloClient();

  return (
    <ApolloProvider client={client}>
      <ConfigProvider
        locale={deDE}
        theme={{
          token: {
            fontSizeHeading5: theme.defaultConfig.token.fontSize,
          },
        }}
      >
        <BookingTable onSelect={setSelected} />
        <BandApplicationDetails
          bandApplicationId={selected}
          onClose={() => setSelected(null)}
        />
      </ConfigProvider>
    </ApolloProvider>
  );
}
