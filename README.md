# Reddit Bot Scraper

## Description

The motivation behind this bot is to showcase how you can create a reddit scraper bot. The application for this specific bot is to get the `hot` or `new` comments(topics) in a specific category.

Moreover, it can be configured to search for specific keywords and bring only relevant results.

## Setup

Open up `index.js` and configure the subreddit to scrape from. See examples below for various ways to use it.

Example:

```javascript
// index.js

// initialize(subreddit: String, options: Object)
// if no options are passed it defaults to { headless: false, devtools: true}

await reddit.initialize("smallbusiness", {
  headless: false,
  devtools: false
});
```

### Usage Examples

```javascript
// Get latest 25 topics in specific subreddit
const results = await reddit.get();

// Search the 'new' tab of subreddit and bring first 10 results
const results = await reddit.get({
  type: "new",
  number: 10
});

// Get up to 5 results
const results = await reddit.get({
  limit: 5
});

// limit to 5 results matching keyword criteria
const results = await reddit.searchFor(["reminder", "appointment"]).get(5);

// Same as above in a more verbose way
const results = await reddit
  .searchFor(["reminder", "appointment"])
  .get({ limit: 5 });

// Get 100 topics and THEN filter by keywords
const results = await reddit.getLatest({
  type: "hot",
  number: 100,
  keywords: ["appointment", "reminder"]
});

// Alias of .get()
const results = await reddit.getLatestHot();

// Alias of .get() configured for the 'new' tab in Reddit
const results = await reddit.getLatestNew();
```

## Contributions welcome
