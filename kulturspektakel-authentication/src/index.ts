import { defineHook } from "@directus/extensions-sdk";

export default defineHook(({ filter, action }, { database, env }) => {
  filter("authenticate", (a, { req }) => {
    // check if kult cookie exists
    // get user from kult cookie
    // create directus_user if needed
    // insert directus_sessions for user
    // set refresh_token
    // set cookie if possible?

    console.log(database, env);

    req.body.refresh_token =
      "URi-aU-Ucx_5HTxtZ_nnJP3rnFrH1KMtYFEcoF4GO8wtDqzmhbwC13EiU8pGu0rw";
  });
});
