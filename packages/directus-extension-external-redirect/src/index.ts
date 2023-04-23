import {defineModule} from '@directus/extensions-sdk';
import ModuleComponent from './module.vue';

export default defineModule({
  id: 'redirect',
  name: 'Redirect',
  icon: 'box',
  routes: [
    {
      path: '',
      component: ModuleComponent,
    },
  ],
});
