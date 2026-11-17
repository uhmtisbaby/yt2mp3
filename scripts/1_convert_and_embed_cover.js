// ============================================================================
// JDownloader 2 Event Scripter: Convert Audio to MP3 & Embed Cover Art
// Trigger Required: "A Download Stopped"
// Requirements: FFmpeg & FFprobe (configured in JDownloader settings)
// ============================================================================

if (link.isFinished()) {
    var sourceFile = link.getDownloadPath();
    var audioFile = /\.(aac|m4a|ogg|opus)$/i.test(sourceFile);

    if (audioFile) {
        var fileName = link.name.replace(/(.+)(\..+$)/, "$1");
        // Strip trailing quality tags in parentheses (e.g., "(128kbit_AAC)") to match base title
        var baseName = fileName.replace(/\s*\([^)]*\)\s*$/, "").trim();

        var downloadFolder = package.getDownloadFolder();
        var destFile = downloadFolder + "/" + fileName + ".mp3";
        var ffmpeg = callAPI("config", "get", "org.jdownloader.controlling.ffmpeg.FFmpegSetup", null, "binarypath");
        var ffprobe = callAPI("config", "get", "org.jdownloader.controlling.ffmpeg.FFmpegSetup", null, "binarypathprobe");

        var data = JSON.parse(callSync(ffprobe, "-v", "quiet", "-print_format", "json", "-show_streams", "-show_format", sourceFile));
        var streamsBitrate = data.streams[0].bit_rate ? data.streams[0].bit_rate : 0;
        var formatBitrate = data.format.bit_rate ? data.format.bit_rate : 0;
        var bitrate = Math.max(streamsBitrate, formatBitrate) / 1000;

        // Configuration Flags
        var deleteSourceFile = true; // Set to true to delete original audio after MP3 conversion
        var deleteCoverFile = true;  // Set to true to delete standalone image after embedding

        if (bitrate > 0) {
            var coverFile = null;
            var folderFiles = getPath(downloadFolder).getChildren();

            // Search download folder for any image matching the base title
            for (var i = 0; i < folderFiles.length; i++) {
                var fPath = folderFiles[i].toString();
                var fName = folderFiles[i].getName();

                if (/\.(jpg|jpeg|png|webp)$/i.test(fName) && fName.indexOf(baseName) === 0) {
                    coverFile = fPath;
                    break;
                }
            }

            if (coverFile) {
                // Convert audio to MP3 AND transcode thumbnail to MJPEG for universal player compatibility (VLC, Windows, etc.)
                callSync(
                    ffmpeg, "-y",
                    "-i", sourceFile,
                    "-i", coverFile,
                    "-map", "0:a",
                    "-map", "1:v",
                    "-c:a", "libmp3lame",
                    "-b:a", bitrate + "k",
                    "-c:v", "mjpeg",
                    "-disposition:v", "attached_pic",
                    "-id3v2_version", "3",
                    "-metadata:s:v", "title=Album cover",
                    "-metadata:s:v", "comment=Cover (front)",
                    destFile
                );

                if (deleteCoverFile && getPath(destFile).exists()) {
                    deleteFile(coverFile, false);
                }
            } else {
                // Fallback: Convert audio only if no matching thumbnail is found
                callSync(ffmpeg, "-y", "-i", sourceFile, "-b:a", bitrate + "k", destFile);
            }

            if (deleteSourceFile && getPath(destFile).exists()) {
                deleteFile(sourceFile, false);
            }
        }
    }
}
