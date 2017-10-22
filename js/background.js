"use strict";

var Gadget = {
  browserAction: function(tab) {
    var tabId = tab.id,
        tabTitle = tab.title,
        tabUrl = tab.url;

    var args = "'action': 'loadtest'," +
			"'loaded': window.hasOwnProperty('__DevGadget')," +
			"'active': window.hasOwnProperty('__DevGadget') && window.__DevGadget.active";

		// get the tab to send a message back to the background script telling it of the addon state
		chrome.tabs.executeScript(tabId, {
			code:	"chrome.runtime.sendMessage({ " + args + " });"
		});
  },

  load: function(tabId) {
    console.log('loading content script');

    // load the script
    chrome.tabs.executeScript(
      tabId,
      {
        file:	"js/content.js"
      },
      function() {
        console.log('content script for tab #' + tabId + ' has loaded');

        // save the tab loaded state and then load the addon
        Gadget.enable(tabId);
      }
    );
  },

  enable: function(tabId) {
    // send message to the tab telling it to activate
		chrome.tabs.sendMessage(
			tabId,
			{
				type: 'enable'
			},
			function(success) {
				console.log('enable message for tab #' + tabId + ' was sent');

				// update browser action icon to active state
				chrome.browserAction.setIcon({
					"path": "images/active/icon16.png",
					"tabId": tabId
				});
			}
		);
  },

  disable: function(tabId) {
    chrome.tabs.sendMessage(
      tabId,
      {
        type: 'disable'
      },
      function(success) {
        console.log('disable message for tab #' + tabId + ' was sent');

        chrome.browserAction.setIcon({
          "path": "images/icon16.png",
          "tabId": tabId
        });
      }
    );

    chrome.tabs.executeScript(
      tabId,
      {
        file:	"js/content.js"
      }
    );
  }
};

chrome.browserAction.onClicked.addListener(Gadget.browserAction);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	// get tab id
	var tabId = sender.tab && sender.tab.id;

	console.group('message received from tab #' + tabId)
	console.log('message: ', message);
	console.log('sender: ', sender);

  switch (message.action) {
		// check whether the addon content script is loaded and it's active state
		case 'loadtest':
			// content script not yet loaded
			if (!message.loaded) {
				// load it
				Gadget.load(tabId);
			}
			// content script is loaded
			else {
				// addon is active
				if (message.active) {
					// disable it
					Gadget.disable(tabId);
				}
				// addon is inactive
				else {
					// enable it
					Gadget.enable(tabId);
				}
			}

		break;

    case 'disable':
      console.log('tear down');

      if (tabId) {
        Gadget.disable(tabId);
      }

    break;
  }

  console.groupEnd();
  return true;
});

chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
});
