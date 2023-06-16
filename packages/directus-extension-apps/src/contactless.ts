import {defineModule} from '@directus/extensions-sdk';
import ModuleComponent from './app.vue';

export default defineModule({
  id: 'contactless',
  name: 'Contactless',
  icon: 'contactless',
  routes: [
    {
      path: '',
      component: ModuleComponent,
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
