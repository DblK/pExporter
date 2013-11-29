// Install Content script
var s = document.createElement('script');
s.src = chrome.extension.getURL('pExport-@VERSFILE.js');
s.defer = 'true';
s.onload = function() {
	this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);

// Add Image to document to allow picture on button
var image = document.createElement("img");
image.src = chrome.extension.getURL("img/pExport.png");
image.id = "pExport-Img";
document.getElementsByTagName("body")[0].appendChild(image);

// Load options from background page at first RUN
chrome.runtime.sendMessage({}, function(response) {
	var t = document.createElement('script');
	t.onload = function() {
		this.parentNode.removeChild(this);
	};
	
	var getI18nMsg = chrome.i18n.getMessage;
	t.textContent = "var pExport = { texts: {" +
		"button: '" + getI18nMsg('button') + "'," +
		"track: '" + getI18nMsg('track') + "'," +
		"song: '" + getI18nMsg('song') + "'," +
		"artist: '" + getI18nMsg('artist') + "'," +
		"album: '" + getI18nMsg('album') + "'," +
		"time: '" + getI18nMsg('time') + "'" +
		"}, output: '" + response.ext + "'};";

	(document.head||document.documentElement).appendChild(t);
});


// Catch updated options
chrome.runtime.onMessage.addListener(function(msg, sender) {
	var u = document.createElement('script');
	u.textContent = "pExport.output = '" + msg.ext + "'; UpdateButton();";
	(document.head||document.documentElement).appendChild(u);
	u.onload = function() {
		this.parentNode.removeChild(this);
	};
});