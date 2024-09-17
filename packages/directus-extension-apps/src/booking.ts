import {defineModule} from '@directus/extensions-sdk';
import ModuleComponent from './app.vue';

export default defineModule({
  id: 'booking',
  name: 'Booking',
  icon: 'music_note',
  routes: [
    {
      path: '',
      component: ModuleComponent,
      beforeEnter() {
        return `/booking/kult2025`;
      },
    },
    {
      path: ':feature',
      component: ModuleComponent,
      props: (route) => ({
        feature: route.params.feature,
      }),
    },
  ],
});
