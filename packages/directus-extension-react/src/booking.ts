import {defineModule} from '@directus/extensions-sdk';
import ModuleComponent from './booking.vue';

export default defineModule({
  id: 'booking',
  name: 'Booking',
  icon: 'star',
  routes: [
    {
      path: '',
      component: ModuleComponent,
    },
  ],
});
