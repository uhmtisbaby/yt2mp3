// ============================================================================
// JDownloader 2 Event Scripter: One-Click "Download Audio + Cover Only"
// Trigger Required: "Linkgrabber Contextmenu Button Pressed"
// ============================================================================

var links = lgSelection.getLinks();

if (links.length > 0) {
    var linksToStart = [];

    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var name = link.getName();

        // Match audio streams and thumbnail images
        var isAudio = /\.(aac|m4a|ogg|opus|mp3|wav|flac)$/i.test(name);
        var isImage = /\.(jpg|jpeg|png|webp)$/i.test(name);

        if (isAudio || isImage) {
            link.setEnabled(true);
            linksToStart.push(link);
        } else {
            link.setEnabled(false);
        }
    }

    // Move enabled audio & image links straight to the Downloads list
    if (linksToStart.length > 0) {
        callAPI(
            "linkgrabberv2",
            "moveToDownloadlist",
            linksToStart.map(function(l) { return l.getUUID(); }),
            []
        );
    }
}
