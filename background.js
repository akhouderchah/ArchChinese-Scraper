chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
	chrome.declarativeContent.onPageChanged.addRules([{
	  conditions: [new chrome.declarativeContent.PageStateMatcher({
		pageUrl: {hostEquals: 'www.archchinese.com'},
	  })
	  ],
	  actions: [new chrome.declarativeContent.ShowPageAction()]
	}]);
  });
});

chrome.commands.onCommand.addListener(function(command) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	chrome.tabs.executeScript(
		tabs[0].id,
		{file: 'scrape.js'}
	);
  });
});
