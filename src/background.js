// Refresh Options
function RefreshOptions() {
	// If options changed
	if(localStorage['optionsChanged'] == "yes") {
		localStorage['optionsChanged'] = 'no';

		// Look for tabs with extension
		chrome.tabs.query({url : "*://*.deezer.com/*"}, function (tabs) {
			// Send Update Message to all Deezer Tabs
			for(var i=0;i<tabs.length;i++) {
				chrome.tabs.sendMessage(tabs[i].id, {ext: localStorage['output']});
			}			
		});
	}
}

// Check Options everything 5 s
var Interval = setInterval(RefreshOptions, 5000);

// Install or Update
chrome.runtime.onInstalled.addListener(function() {
	//console.log("Installed.");
	
	if(localStorage['optionsChanged'] === undefined) {
		//console.log("Update localstorage");
		localStorage.setItem('output', 'csv');
		localStorage.setItem('optionsChanged', 'yes');
	}
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  sendResponse({ext: localStorage['output']});
});