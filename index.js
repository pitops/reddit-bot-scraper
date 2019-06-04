const reddit = require("./reddit");

(async () => {
  await reddit.initialize("smallbusiness", {
    headless: true,
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

  // const results = await reddit.getLatestHot();
  // const results = await reddit.getLatestNew();

  const results = await reddit.getLatest({
    type: "hot",
    number: 150
    // keywords: ["appointment", "reminder"]
  });

  if (!results.length) {
    console.log("No results");
  }

  results.forEach(result => {
    console.log("\n");
    console.log(`Title: ${result.title}`);
    console.log(`Link: ${result.link}`);
    console.log("\n");
  });
})();
