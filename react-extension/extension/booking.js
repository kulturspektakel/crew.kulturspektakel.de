import {defineModule} from '@directus/extensions-sdk';
import ModuleComponent from './module.vue';

export default defineModule({
  id: 'react',
  name: 'Booking',
  icon: 'star',
  routes: [
    {
      path: '/react',
      component: ModuleComponent,
    },
  ],
});
