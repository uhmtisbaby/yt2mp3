# 🎵 JDownloader 2: YouTube Audio to MP3 + Embedded Cover Art

An automated workflow for **JDownloader 2** that turns any YouTube video or playlist into properly tagged **MP3 files with embedded thumbnail artwork** in a single click.

## ✨ Features
* **One-Click Context Menu Action:** Right-click any package in LinkGrabber and select **Download Audio + Cover Only** to skip videos/subtitles and grab only the audio + thumbnail.
* **Automatic Image Prioritization:** Ensures thumbnails finish downloading *before* audio streams so artwork is always ready for embedding.
* **Smart Title Matching:** Strips JDownloader quality suffixes (e.g., `(128kbit_AAC)`) to reliably pair thumbnails with audio files.
* **Universal Media Player Support:** Automatically converts `.webp` thumbnails to `MJPEG` (`attached_pic` ID3v2.3 tags) so album art renders cleanly in VLC, Windows Media Player, iTunes, and mobile players.
* **Auto-Cleanup:** Deletes temporary source audio files and standalone thumbnail images after conversion.

---

## 📋 Prerequisites

1. **JDownloader 2** installed and updated.
2. **Event Scripter** extension installed in JDownloader:
   * Go to **Settings > Extension Modules** (or **Plugins**).
   * Search for **Event Scripter**, install it, and restart JDownloader if prompted.
3. **FFmpeg & FFprobe** enabled in JDownloader (JDownloader normally prompts to install these automatically on first media download).
4. **YouTube Plugin Thumbnail Grabbing Enabled:**
   * Go to **Settings > Plugins > youtube.com**.
   * Ensure **Thumbnail** (or **Best Image**) is enabled in the media types list.

---

## 🚀 Installation & Setup

### Step 1: Prioritize Thumbnail Downloads (Packagizer Rule)
Because the conversion script triggers the instant an audio download finishes, the thumbnail must already be on disk.

1. Open **Settings > Packagizer** and click **Add**.
2. **Rule Name:** `Prioritize YouTube Thumbnails`
3. Under **If the following conditions match...**:
   * Check **File Type** → select **is** → choose **Image**.
4. Under **...then set**:
   * Check **Priority** → select **Highest**.
5. Click **Save** and ensure the rule is enabled.

---

### Step 2: Add the Conversion & Cover Embedding Script

1. Go to **Settings > Event Scripter** and click **Add**.
2. **Name:** `Convert Audio to MP3 + Embed Cover`
3. **Trigger:** Select **A Download Stopped** from the dropdown.
4. Click **Edit**, paste the contents of [`scripts/1_convert_and_embed_cover.js`](scripts/1_convert_and_embed_cover.js), and click **Save**.

> **Optional Customization:** Inside the script, you can set `deleteSourceFile = false` or `deleteCoverFile = false` if you wish to keep the original files after conversion.

---

### Step 3: Add the One-Click LinkGrabber Menu Action

1. Go to **Settings > Event Scripter** and click **Add**.
2. **Name:** `Download Audio + Cover Only` *(must match the menu item name in Step 4)*.
3. **Trigger:** Select **Linkgrabber Contextmenu Button Pressed**.
4. Click **Edit**, paste the contents of [`scripts/2_download_audio_and_cover_only.js`](scripts/2_download_audio_and_cover_only.js), and click **Save**.

---

### Step 4: Add the Button to Your Right-Click Menu

1. Right-click anywhere inside the **LinkGrabber** tab and select **Open Menu Manager** at the bottom.
2. Click the **Add (+)** button at the bottom left and select **EventScripter Trigger**.
3. Select the newly added item in the list, and in the **Properties** panel on the right, set **Name** to:
   ```text
   Download Audio + Cover Only
   ```
4. *(Optional)* Drag the item higher up in the menu tree or assign a custom icon.
5. Click **Save**.

---

## 🎯 Usage

1. Copy a YouTube video or playlist URL into JDownloader's **LinkGrabber**.
2. Wait for JDownloader to finish crawling the links.
3. **Right-click** the package(s) and select **Download Audio + Cover Only**.
4. Sit back—JDownloader will download the thumbnail first, convert the audio to MP3 at its original bitrate, embed the cover art, and clean up temporary files automatically!
