module.exports = ({ filter, action }) => {
  console.log("-----------------------");
  // filter("items.create", () => {
  //   console.log("Creating Item!");
  // });
  // action("items.create", () => {
  //   console.log("Item created!");
  // });
  filter("authenticate", (accountability, { req }) => {
    console.log("asdasd");
    // return {
    //   ...accountability,
    // };

    req.body.refresh_token =
      "zJ6f5ForZSAXbQgq_healLiB_94nzo6F3Bx_Upm8o2t3uklNLJrQFEvL1DclNBPr";

    return {
      ...accountability,
      admin: true,
      app: true,
      role: "3330a1e9-409c-402e-8b01-20a37c52173b",
      user: "a547985d-0344-47fc-a839-e04da93d5aab",
    };
  });
};
