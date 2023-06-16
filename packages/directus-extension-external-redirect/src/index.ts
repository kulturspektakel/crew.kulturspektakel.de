import {defineModule} from '@directus/extensions-sdk';
import ModuleComponent from './module.vue';

export default defineModule({
  id: 'redirect',
  name: 'Redirect',
  icon: 'box',
  hidden: true,
  preRegisterCheck(user) {
    return user.role.admin_access === true;
  },
  routes: [
    {
      path: '',
      component: ModuleComponent,
    },
  ],
});
