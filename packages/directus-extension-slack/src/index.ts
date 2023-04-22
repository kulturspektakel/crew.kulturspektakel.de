import {defineHook} from '@directus/extensions-sdk';
import {FilterHandler, User} from '@directus/types';

const filterHook: FilterHandler<User> = async (
  userPayload,
  data,
  {database},
) => {
  const {providerPayload} = data as {
    event: 'auth.update' | 'auth.create';
    identifier: string;
    provider: 'slack';
    providerPayload: {
      accessToken: string;
      userInfo: {
        ok: true;
        'user.name': string;
        'user.id': string;
        'user.email': string;
        'user.image_24': string;
        'user.image_32': string;
        'user.image_48': string;
        'user.image_72': string;
        'user.image_192': string;
        'user.image_512': string;
        'user.image_1024': string;
        'team.id': string;
      };
    };
  };

  const [token] = await database('directus_users').whereNotNull('token');

  const {
    data: {id},
  }: {data: {id: string}} = await fetch(
    `${process.env.PUBLIC_URL?.replace('localhost', '127.0.0.1')}/files/import`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.token}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        url: providerPayload.userInfo['user.image_192'],
        data: {
          title: providerPayload.userInfo['user.name'],
          folder: '5ecf7a4d-821a-4e0b-aac8-380c1ef994fe',
        },
      }),
    },
  ).then((res) => res.json());

  await database('Viewer')
    .insert({
      id: providerPayload.userInfo['user.id'],
      email: providerPayload.userInfo['user.email'],
      displayName: providerPayload.userInfo['user.name'],
      profilePicture: providerPayload.userInfo['user.image_192'],
      slackToken: providerPayload.accessToken,
    })
    .onConflict('id')
    .merge()
    .returning('*');

  const [first_name = '', ...last_name] =
    providerPayload.userInfo['user.name'].split(' ');

  return {
    ...userPayload,
    first_name,
    last_name: last_name.join(' '),
    email: providerPayload.userInfo['user.email'],
    avatar: {id},
  };
};

export default defineHook(({filter}) => {
  // @ts-ignore
  filter('auth.create', filterHook);
  // @ts-ignore
  filter('auth.update', filterHook);
});
