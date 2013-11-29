console.info('pExport launched');
$('#pExport-Img').css('display', 'none');

// Redefine Deezer function to add new button
var _hideLoading = hideLoading;
hideLoading = function() {
	console.log('hideLoading');
	_hideLoading.apply(this, arguments);
	insertBtn();
}
insertBtn();

// Insert button "Extract"
function insertBtn() {
	if($('#naboo_datagrid_listen').length != 0 && ($('#pExport').length == 0)) {
		var link = $('<a id="pExport" class="btn" style="display: inline-block; margin-left: 10px;"><i class="icon_export"></i>&nbsp;&nbsp;' + pExport.texts.button + '</a>');
		link.insertAfter('#naboo_datagrid_listen');
		link.children('i').css('background-image', 'url("' + $('#pExport-Img').attr('src') + '")');
	}
	// Update data linked to the new button
	UpdateButton();
}

// Prepare data for download
function UpdateButton() {
	var type = actual_box.split('/')[0];
	var idTitle;				// Title of the Id used for the output file
	var output = pExport.output; // Type of output (CSV, groovylists)
	var ext;					// File extension

	output == "groovylists" ? ext = "txt" : ext = "csv";

	switch(type) {
		case "album":
			idTitle =  "#naboo_album_title";
			break;
		case "playlist":
			idTitle =  "#naboo_playlist_title";
			break;
		default:
	}

	$('#pExport')
		.attr("download", "pExport-" + $(idTitle).text().trim() + "." + ext)
		.attr("href", "data:text/" + ext +";charset=utf-8," + retrievePlaylist(type, ext));
}

// Retrieve the current playlist
function retrievePlaylist(type, ext) {
	var file = "";
	var tableref = "";

	// Header of file
	switch(type) {
		case "album":
			if(ext == "csv") {
				file = pExport.texts.track + ";" + pExport.texts.song + ";" + pExport.texts.time + "\n";
			}
			tableref = 'naboo_album_tracks';
			break;
		case "playlist":
			if(ext == "csv") {
				file = pExport.texts.song + ";" + pExport.texts.artist + ";" + pExport.texts.album + ";" + pExport.texts.time + "\n";
			}
			tableref = 'tab_tracks_content';
			break;
		default:
	}

	// Browse current table
	$('#' + tableref + ' table tbody tr.song').each(function(el) {
			// Build object with all information
			var muz = {
				track: rewriting($(this).children('td.position').children('span.number').text().trim()),
				song: rewriting($(this).children('td.track').children('div.text-ellipsis').children('a').text().trim()),
				artist: type == 'album' ? rewriting($('#naboo_album_artist').children('a').text()) : rewriting($(this).children('td.artist').children('div.text-ellipsis').children('a').text().trim()),
				album: rewriting($(this).children('td.album').children('div.text-ellipsis').children('a').text().trim()),
				time: $(this).children('td.length').text().trim()
			};

			// Add the wanted information
			if(ext == "csv") {
				switch(type) {
					case "album":
						file += muz.track + ";" + muz.song + ";" + muz.time + "\n";
						break;

					default: // playlist
						file += muz.song + ";" + muz.artist + ";" + muz.album + ";" + muz.time + "\n";
				}
			} else {
				file += muz.artist + " - " + muz.song + "\r\n";
			}
		});

	return encodeURIComponent(file);
}