const reddit = require("./reddit");

(async () => {
  await reddit.initialize("smallbusiness", {
    headless: false,
    devtools: false
  });

  // const results = await reddit.get();
  // const results = await reddit.get({
  //   type: "new",
  //   number: 10
  // });
  // const results = await reddit.get({
  //   limit: 5
  // });

  // const results = await reddit.searchFor(["reminder", "appointment"]).get(5);
  // const results = await reddit
  //   .searchFor(["reminder", "appointment"])
  //   .get({ limit: 5 });

  // const results = await reddit.getLatest({
  //   type: "hot",
  //   number: 100,
  //   keywords: ["appointment", "reminder"]
  // });
  // const results = await reddit.getLatestHot();
  // const results = await reddit.getLatestNew();

  debugger;
})();
