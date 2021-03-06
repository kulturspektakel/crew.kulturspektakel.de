import {DownOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import {gql} from '@apollo/client';
import {
  Button,
  Modal,
  Rate,
  Form,
  Select,
  Spin,
  Tag,
  List,
  Dropdown,
  Menu,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import {
  add,
  max,
  min,
  sub,
  isSameDay,
  isBefore,
  isAfter,
  isEqual,
} from 'date-fns';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import React, {useCallback, useState} from 'react';
import {useEffect} from 'react';
import {
  ReservationModalQuery,
  useCancelReservationMutation,
  useReservationModalQuery,
  useSwapReservationsMutation,
  useUpdateOtherPersonsMutation,
  useUpdateReservationMutation,
} from '../../types/graphql';
import GuestInput from './GuestInput';
import {SLOT_LENGTH_MIN} from './Slots';
import StatusBadge from './StatusBadge';
import TimePicker from './TimePicker';
import styles from './useReservationModal.module.css';
const {confirm} = Modal;

gql`
  fragment ReservationFragment on Reservation {
    id
    startTime
    endTime
    status
    checkedInPersons
    primaryPerson
    primaryEmail
    otherPersons
    note
    reservationsFromSamePerson {
      id
      startTime
      endTime
      otherPersons
      table {
        id
        area {
          id
          displayName
        }
      }
    }
    availableToCheckIn
    alternativeTables {
      id
      displayName
      area {
        id
        displayName
      }
    }
    table {
      id
      displayName
      maxCapacity
      reservations {
        id
        startTime
        endTime
        status
      }
      area {
        id
        displayName
        openingHour {
          startTime
          endTime
        }
      }
    }
    swappableWith {
      id
      primaryPerson
      status
      table {
        id
        displayName
      }
    }
  }

  mutation UpdateReservation(
    $id: Int!
    $persons: Int
    $startTime: DateTime
    $endTime: DateTime
    $note: String
    $tableId: ID
    $primaryPerson: String
  ) {
    updateReservation(
      id: $id
      checkedInPersons: $persons
      startTime: $startTime
      endTime: $endTime
      note: $note
      tableId: $tableId
      primaryPerson: $primaryPerson
    ) {
      ...ReservationFragment
    }
  }

  mutation CancelReservation($token: String!) {
    cancelReservation(token: $token)
  }

  mutation UpdateOtherPersons($token: String!, $otherPersons: [String!]!) {
    updateReservationOtherPersons(otherPersons: $otherPersons, token: $token) {
      ...ReservationFragment
    }
  }

  mutation SwapReservations($a: Int!, $b: Int!) {
    swapReservations(a: $a, b: $b)
  }

  query ReservationModal($token: String!) {
    availableCapacity
    reservationForToken(token: $token) {
      ...ReservationFragment
    }
    areas {
      id
      displayName
    }
  }
`;

export default function useReservationModal(): [
  (token: string) => void,
  React.ReactElement,
] {
  const [token, setToken] = useState<string | null>(null);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const {data} = useReservationModalQuery({
    variables: {
      token,
    },
    skip: !token,
    onError: console.error,
  });
  const [updateReservation] = useUpdateReservationMutation();
  const [updateOtherPersons] = useUpdateOtherPersonsMutation();
  const [swapReservations] = useSwapReservationsMutation();
  const [cancelReservation, {loading}] = useCancelReservationMutation();
  const [note, setNote] = useState<string | undefined>();

  const onClear = useCallback(() => {
    confirm({
      title: `Reservierung #${data?.reservationForToken?.id} l??schen`,
      icon: <ExclamationCircleOutlined />,
      content:
        'Die Reservierung ist dann nicht mehr verf??gbar und die Pl??tze k??nnen neu vergeben werden.',
      okButtonProps: {
        danger: true,
      },
      okText: 'L??schen',
      cancelText: 'Abbrechen',
      onOk: () => {
        cancelReservation({
          variables: {
            token,
          },
          refetchQueries: ['Slots'],
          awaitRefetchQueries: true,
        }).then(() => setToken(null));
      },
    });
  }, [data?.reservationForToken]);

  useEffect(() => {
    setShowNotes(Boolean(data?.reservationForToken?.note));
    setNote(data?.reservationForToken?.note);
  }, [data?.reservationForToken?.note]);

  const handleClose = () => {
    if (data?.reservationForToken?.note !== note) {
      updateReservation({
        variables: {
          id: data?.reservationForToken?.id,
          note,
        },
      });
    }
    setToken(null);
  };

  let content = null;

  if (data?.reservationForToken) {
    const reserved = data.reservationForToken.otherPersons.length + 1;
    const reservationIndex = data.reservationForToken.table.reservations.findIndex(
      (r) => r.id === data.reservationForToken.id,
    );

    const opening: Date | null = data.reservationForToken.table.area.openingHour.find(
      ({startTime}) => isSameDay(startTime, data.reservationForToken.startTime),
    )?.startTime;
    const ending: Date | null = data.reservationForToken.table.area.openingHour.find(
      ({endTime}) => isSameDay(endTime, data.reservationForToken.endTime),
    )?.endTime;

    content = (
      <Form labelCol={{span: 8}}>
        <div className={styles.rater}>
          <h4>G??ste einchecken</h4>
          <Rate
            value={data.reservationForToken.checkedInPersons}
            count={data.reservationForToken.table.maxCapacity}
            character={({value, index}) => (
              <Button
                type={index < Math.max(reserved, value) ? 'primary' : 'default'}
                ghost={index >= value && index < reserved}
                shape="circle"
              >
                {index + 1}
              </Button>
            )}
            onChange={(persons) => {
              const onOk = () =>
                updateReservation({
                  variables: {
                    id: data.reservationForToken.id,
                    persons,
                  },
                });
              const now = new Date();

              if (data.reservationForToken.availableToCheckIn < persons) {
                Modal.confirm({
                  title: 'Kapazit??tslimit erreicht',
                  content: `Wenn du ${persons} Personen eincheckst wird damit das Kapazit??tslimit um ${
                    persons - data.reservationForToken.availableToCheckIn
                  } Personen ??berschritten.`,
                  okText: 'Einchecken',
                  cancelText: 'Abbrechen',
                  onOk,
                });
              } else if (
                data.availableCapacity +
                  data.reservationForToken.checkedInPersons <
                persons
              ) {
                Modal.confirm({
                  title: 'Mehr Personen als reserviert',
                  content: `Die Reservierung ist nur f??r ${
                    data.reservationForToken.otherPersons.length + 1
                  } Personen. Wenn du ${persons} Personen f??r diese Reservierung eincheckst, kann es passieren, dass andere Personen, die reserviert haben keinen Platz mehr bekommen.`,
                  okText: 'Einchecken',
                  cancelText: 'Abbrechen',
                  onOk,
                });
              } else if (
                data.reservationForToken.status !== 'CheckedIn' &&
                differenceInMinutes(data.reservationForToken.startTime, now) >
                  10
              ) {
                Modal.confirm({
                  title: 'Reservierung beginnt sp??ter',
                  content: `Die Reservierung beginnt erst sp??ter, soll sie trotzdem schon eingecheckt werden?`,
                  okText: 'Einchecken',
                  cancelText: 'Abbrechen',
                  onOk,
                });
              } else {
                onOk();
              }
            }}
          />
          <p className={styles.info}>
            Eingechekt:{' '}
            <strong>{data.reservationForToken.checkedInPersons}</strong>{' '}
            &middot; Reserviert f??r: <strong>{reserved}</strong> &middot; Platz
            f??r: <strong>{data.reservationForToken.table.maxCapacity}</strong>
          </p>
        </div>
        <Form.Item label="Status">
          <StatusBadge
            status={data.reservationForToken.status}
            startTime={data.reservationForToken.startTime}
            endTime={data.reservationForToken.endTime}
            showAll
          />
        </Form.Item>
        <Form.Item label="Tisch">
          <TablePicker
            areas={data.areas}
            alternativeTables={data.reservationForToken.alternativeTables}
            selected={data.reservationForToken.table}
            onChange={(value) =>
              updateReservation({
                variables: {
                  id: data.reservationForToken.id,
                  tableId: value,
                },
                refetchQueries: ['Slots'],
              })
            }
          />
        </Form.Item>
        <Form.Item label="Zeit">
          <div className={styles.row}>
            <TimePicker
              onChange={(value) =>
                updateReservation({
                  variables: {
                    id: data.reservationForToken.id,
                    startTime: value,
                  },
                })
              }
              min={max(
                [
                  sub(data.reservationForToken.startTime, {
                    minutes: SLOT_LENGTH_MIN * 4,
                  }),
                  opening,
                  data.reservationForToken.table.reservations[
                    reservationIndex - 1
                  ]?.endTime,
                ].filter(Boolean),
              )}
              max={sub(data.reservationForToken.endTime, {
                minutes: SLOT_LENGTH_MIN,
              })}
              selected={data.reservationForToken.startTime}
            />
            <span>bis</span>
            <TimePicker
              onChange={(value) =>
                updateReservation({
                  variables: {
                    id: data.reservationForToken.id,
                    endTime: value,
                  },
                })
              }
              min={add(data.reservationForToken.startTime, {
                minutes: SLOT_LENGTH_MIN,
              })}
              max={min(
                [
                  add(data.reservationForToken.endTime, {
                    minutes: SLOT_LENGTH_MIN * 4,
                  }),
                  ending,
                  data.reservationForToken.table.reservations[
                    reservationIndex + 1
                  ]?.startTime,
                ].filter(Boolean),
              )}
              selected={data.reservationForToken.endTime}
            />
          </div>
        </Form.Item>
        <Form.Item label="G??ste">
          <GuestInput
            onChange={(guests) => {
              let primaryUpdate;
              if (guests[0] !== data.reservationForToken.primaryPerson) {
                primaryUpdate = updateReservation({
                  variables: {
                    id: data.reservationForToken.id,
                    primaryPerson: guests[0],
                  },
                  optimisticResponse: {
                    updateReservation: {
                      ...data.reservationForToken,
                      primaryPerson: guests[0],
                    },
                  },
                });
              }

              return Promise.all([
                primaryUpdate,
                updateOtherPersons({
                  variables: {
                    token,
                    otherPersons: guests.slice(1),
                  },
                  optimisticResponse: {
                    updateReservationOtherPersons: {
                      ...data.reservationForToken,
                      otherPersons: guests.slice(1),
                    },
                  },
                }),
              ]);
            }}
            maxCapacity={data.reservationForToken.table.maxCapacity}
            value={[
              data.reservationForToken.primaryPerson,
              ...data.reservationForToken.otherPersons,
            ]}
          />
        </Form.Item>
        {(showNotes || data.reservationForToken.note) && (
          <TextArea
            rows={3}
            placeholder="Interne Notizen"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        )}
        {!showNotes && !data.reservationForToken.note && (
          <>
            <Button onClick={() => setShowNotes(true)}>Notiz hinzuf??gen</Button>
            &emsp;
          </>
        )}
        {data.reservationForToken.swappableWith.length > 0 && (
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                {data.reservationForToken.swappableWith.map((r) => (
                  <Menu.Item
                    key={r.id}
                    onClick={() => {
                      const isDanger =
                        r.status === 'CheckedIn' ||
                        data.reservationForToken.status === 'CheckedIn';

                      confirm({
                        title: 'Reservierungen tauschen',
                        icon: isDanger ? <ExclamationCircleOutlined /> : null,
                        content: `Sollen Reservierungen #${r.id}: ${
                          r.primaryPerson
                        } und #${data.reservationForToken.id}: ${
                          data.reservationForToken.primaryPerson
                        } getauscht werden${
                          isDanger
                            ? ', obwohl eine der Reservierungen schon eingechcekt ist'
                            : ''
                        }?`,
                        okText: 'Tauschen',
                        cancelText: 'Abbrechen',
                        onOk: () =>
                          swapReservations({
                            variables: {
                              a: r.id,
                              b: data.reservationForToken.id,
                            },
                            refetchQueries: ['Slots'],
                            awaitRefetchQueries: true,
                          }).then(() => setToken(null)),
                        onCancel() {},
                      });
                    }}
                  >
                    #{r.id}: {r.primaryPerson} ({r.table.displayName})
                  </Menu.Item>
                ))}
              </Menu>
            }
          >
            <Button onClick={(e) => e.preventDefault()}>
              Tauschen
              <DownOutlined />
            </Button>
          </Dropdown>
        )}
        <Button
          danger
          onClick={onClear}
          loading={loading}
          className={styles.delete}
        >
          Reservierung stornieren
        </Button>
        {data.reservationForToken.reservationsFromSamePerson.length > 0 && (
          <div className={styles.otherBookings}>
            <h3>weitere Reservierungen:</h3>
            <List
              itemLayout="horizontal"
              dataSource={data.reservationForToken.reservationsFromSamePerson}
              rowKey={(r) => String(r.id)}
              renderItem={(r) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<div className={styles.avatar}>#{r.id}</div>}
                    title={
                      <>
                        {r.startTime.toLocaleString('de', {
                          weekday: 'long',
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: 'Europe/Berlin',
                        })}{' '}
                        bis{' '}
                        {r.endTime.toLocaleTimeString('de', {
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: 'Europe/Berlin',
                        })}{' '}
                        Uhr
                      </>
                    }
                    description={`${r.table.area.displayName}, ${
                      r.otherPersons.length + 1
                    } Personen`}
                  />
                  <Overlap
                    reservation={r}
                    reservations={[
                      ...data.reservationForToken.reservationsFromSamePerson,
                      data.reservationForToken,
                    ]}
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Form>
    );
  } else {
    content = (
      <div className={styles.spinner}>
        <Spin />
      </div>
    );
  }

  return [
    setToken,
    <Modal
      title={
        data?.reservationForToken
          ? `#${data.reservationForToken.id}: ${data.reservationForToken.primaryPerson}`
          : ''
      }
      footer={null}
      visible={Boolean(token)}
      onOk={handleClose}
      onCancel={handleClose}
    >
      {content}
    </Modal>,
  ];
}

function TablePicker({
  areas,
  alternativeTables,
  selected,
  onChange,
}: {
  areas: ReservationModalQuery['areas'];
  alternativeTables: ReservationModalQuery['reservationForToken']['alternativeTables'];
  selected: ReservationModalQuery['reservationForToken']['table'];
  onChange: (value: string) => void;
}) {
  return (
    <Select onChange={onChange} value={selected.id}>
      {areas.map(({displayName, id}) => (
        <Select.OptGroup key={id} label={displayName}>
          {alternativeTables
            .filter((t) => t.area.id === id)
            .concat(id === selected.area.id ? [selected] : [])
            .sort((a, b) => (a.id < b.id ? -1 : 1))
            .map((t) => (
              <Select.Option value={t.id} key={t.id}>
                {t.area.displayName}: {t.displayName}
              </Select.Option>
            ))}
        </Select.OptGroup>
      ))}
    </Select>
  );
}

function Overlap({
  reservation,
  reservations,
}: {
  reservation: {startTime: Date; endTime: Date; id: number};
  reservations: Array<{startTime: Date; endTime: Date; id: number}>;
}) {
  for (const r of reservations) {
    if (
      r.id != reservation.id &&
      isEqual(r.startTime, reservation.startTime) &&
      isEqual(r.endTime, reservation.endTime)
    ) {
      return <Tag color="error">Doppelbuchung</Tag>;
    } else if (
      r.id != reservation.id &&
      isBefore(r.startTime, reservation.endTime) &&
      isAfter(r.endTime, reservation.startTime)
    ) {
      return <Tag color="warning">??berlappung</Tag>;
    }
  }

  return null;
}
