const puppeteer = require("puppeteer");

const BASE_URL = "https://old.reddit.com";
const SUBREDDIT_URL = subreddit => `${BASE_URL}/r/${subreddit}`;

const self = {
  browser: null,
  page: null,
  keywords: [],
  number: 25,
  type: "hot",
  limit: null,

  initialize: async (subreddit, opts = { headless: false, devtools: true }) => {
    self.browser = await puppeteer.launch(opts);
    self.page = await self.browser.newPage();

    await self.page.goto(SUBREDDIT_URL(subreddit), {
      waitUntil: "networkidle2"
    });
  },

  close: async () => {
    await self.browser.close();
  },

  searchFor: keywords => {
    self.keywords = (Array.isArray(keywords) ? keywords : [keywords]).map(
      keyword => keyword.toLowerCase()
    );

    return self;
  },

  get: async opts => {
    if (
      opts &&
      (Object.entries(opts).length !== 0 && opts.constructor === Object)
    ) {
      self.setOptions(opts);
    } else if (Number.isInteger(opts)) {
      self.limit = opts;
    }

    if (self.type !== "hot") {
      await self[`switchTo${self.type.toUpperCase()}Tab`]();
    }

    let results = [];
    do {
      const parsedResults = await self.parseResults();
      results = [...results, ...parsedResults];

      if (results.length < (self.limit || self.number)) {
        const nextPageButton = await self.page.$(
          'span[class="next-button"] > a[rel="nofollow next"]'
        );

        if (!nextPageButton) break;

        await nextPageButton.click();
        await self.page.waitForNavigation({ waitUntil: "networkidle2" });
      }
    } while (results.length <= (self.limit || self.number));

    if (self.keywords.length) {
      return results
        .slice(0, self.number)
        .filter(result => self.containsAnyOfTheKeywords(result.title));
    }

    return results.slice(0, self.limit || self.number);
  },

  setOptions: opts => {
    Object.entries(opts).forEach(pair => {
      if (self.hasOwnProperty(pair[0])) {
        if (pair[0] === "keywords") {
          self.searchFor(pair[1]);
        } else {
          self[pair[0]] = pair[1];
        }
      }
    });
  },

  getLatest: async opts => {
    if (
      opts &&
      (Object.entries(opts).length !== 0 && opts.constructor === Object)
    ) {
      self.setOptions(opts);
    }
    return await self.get();
  },

  getLatestHot: async opts => {
    return await self.get();
  },

  getLatestNew: async _ => {
    self.type = "new";

    return await self.get();
  },

  parseResults: async () => {
    const elements = await self.page.$$('#siteTable > div[class*="thing"]');
    const results = [];

    for (const element of elements) {
      const title = await element.$eval('p[class="title"]', node =>
        node.innerText.trim()
      );

      if (self.limit && self.keywords.length) {
        if (!self.containsAnyOfTheKeywords(title)) {
          continue;
        }
      }

      const link =
        BASE_URL +
        (await element.$eval('p[class="title"] > a', node =>
          node.getAttribute("href")
        ));
      const rank = await element.$eval('span[class="rank"]', node =>
        node.innerText.trim()
      );
      const postTime = await element.$eval('p[class="tagline "] > time', node =>
        node.getAttribute("title")
      );
      const authorUrl = await element.$eval(
        'p[class="tagline "] > a[class*="author"]',
        node => node.getAttribute("href")
      );
      const authorName = await element.$eval(
        'p[class="tagline "] > a[class*="author"]',
        node => node.innerText.trim()
      );
      const score = await element.$eval('div[class="score likes"]', node =>
        node.innerText.trim()
      );
      const commentsNo = await element.$eval(
        'a[data-event-action="comments"]',
        node => node.innerText.trim()
      );

      results.push({
        title,
        link,
        rank,
        postTime,
        authorUrl,
        authorName,
        score,
        commentsNo
      });
    }

    return results;
  },

  containsAnyOfTheKeywords: text => {
    const textWords = text.split(" ").map(word => word.toLowerCase());
    return self.keywords.some(keyword =>
      textWords.find(word => word === keyword)
    );
  },

  switchToNEWTab: async () => {
    const newTabButton = await self.page.$(
      'ul[class="tabmenu "] li:nth-child(2) a'
    );

    if (!newTabButton) return;

    await newTabButton.click();
    await self.page.waitForNavigation({ waitUntil: "networkidle2" });
  }
};

module.exports = self;
