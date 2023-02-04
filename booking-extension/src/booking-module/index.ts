import { defineModule } from "@directus/extensions-sdk";
import ModuleComponent from "./module.vue";

export default defineModule({
  id: "booking",
  name: "Booking",
  icon: "star",
  routes: [
    {
      path: "/booking",
      component: ModuleComponent,
    },
  ],
});
