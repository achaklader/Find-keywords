async function find(query) {
  browser.runtime.sendMessage({msg: "clear-results"});

  let this_tab_url = browser.runtime.getURL("find.html");
  let tabs = await browser.tabs.query({});

  for (let tab of tabs) {
    // Go through the tabs
    if (tab.url === this_tab_url) {
      continue;
    }


    // After getting the results, send a message back to the query page
    // and highlight the tab if any results are found.
    let result = await browser.find.find(query, {tabId: tab.id});
    browser.runtime.sendMessage({
      msg: "found-result",
      id: tab.id,
      url: tab.url,
      count: result.count
    });

    if (result.count) {
      browser.find.highlightResults({tabId: tab.id});
    }
  }
}

browser.browserAction.onClicked.addListener(() => {
  browser.tabs.create({"url": "/find.html"});
});
