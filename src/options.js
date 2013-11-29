// Execute only when page is loaded
window.addEventListener("load", function(){
	// Update texts
	document.querySelector('#option').innerHTML = chrome.i18n.getMessage('output');
	document.querySelector('#save').innerHTML = chrome.i18n.getMessage('btnsave');

	// Add listener
	document.querySelector('#save').addEventListener('click', save_options);

	// Restore Options
	restore_options();
});

function save_options() {
	var output = document.getElementById("output");
	var format = output.children[output.selectedIndex].value;
	localStorage.setItem('output', format);
	localStorage.setItem('optionsChanged', 'yes');

	// Update status to let user know options were saved.
	var status = document.getElementById("status");
	status.innerHTML = chrome.i18n.getMessage('saved');
	setTimeout(function() {
		status.innerHTML = "";
	}, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	var format = localStorage["output"];
	if (!format) {
		return;
	}
	var output = document.getElementById("output");
	for (var i = 0; i < output.children.length; i++) {
		var child = output.children[i];
		if (child.value == format) {
			child.selected = "true";
			break;
		}
	}
}