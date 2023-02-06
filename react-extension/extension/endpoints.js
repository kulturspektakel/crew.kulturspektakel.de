import {defineEndpoint} from '@directus/extensions-sdk';
import express from 'express';
import path from 'path';

export default defineEndpoint((router) => {
  router.use(
    '/',
    express.static(path.join(__dirname, 'public'), {
      setHeaders: (res) => {
        res.set('Content-Security-Policy', 'none');
      },
    }),
  );
});
