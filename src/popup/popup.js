import { downloadCSV } from './download.js';
const uiMessage = document.querySelector("#message");
let listenersAttached = false;

/**
* Handles the exporting process when clicked.
* Checks response before sending EXPORT_COMMAND
* @param {string} exportType - selected or all
**/
async function handleExportClick(exportType) {
  if (uiMessage) uiMessage.textContent = `Starting to export: ${exportType}...`;

  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs || tabs.length === 0 || !tabs[0]?.id) {
      throw new Error("Could not identify active tab.");
    }

    const activeTab = tabs[0];
    const activeTabId = activeTab.id;

    try {
      const response = await chrome.tabs.sendMessage(activeTabId, {action: "PING"});
      if (response?.status !== "PING") {
        console.error("Ping check failed: Invalid response received:", response);
        throw new Error("Page script didn't respond correctly. Try reloading the page.");
      }
    } catch (error) {
      console.error("Error occurred during PING:", error);
      if (error.message.includes("Receiving end does not exist")) {
        throw new Error("Cannot connect to the script on the EDDM page. Please reload the page and try again.");
      } else {
        throw new Error(`Connection error: ${pingError.message}`);
      }
    }

    if (uiMessage) uiMessage.textContent = `Requesting ${exportType} export...`;
    chrome.tabs.sendMessage(
      activeTabId,
      {
        action: "EXPORT_TYPE",
        exportType: exportType
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn(`Error sending EXPORT_TYPE command:`, chrome.runtime.lastError.message);
        } else {
          console.log("EXPORT_TYPE command sent successfully. Waiting for EXPORT_RESULT.", commandResponse);
          if (uiMessage) uiMessage.textContent = `Export request sent. Processing data...`;
        }
      });
  } catch (error) {
    console.error(`Error: Processing export ${exportType} most likely type is wrong:`, error);
    if (uiMessage) uiMessage.textContent = `Error: ${error.message}`;
  }
}

/**
*
* Setup for event listeners on buttons.
*/
function setupListeners() {
  // removes duplication
  if (listenersAttached){
    return;
  };

  const exportSelectedBtn = document.getElementById("exportSelectedBtn");
  const copySelectedBtn = document.getElementById("copySelectedBtn");
  const exportAllBtn = document.getElementById("exportAllBtn");
  const copyAllBtn = document.getElementById("copyAllBtn")

  if (!exportSelectedBtn || !exportAllBtn && !copySelectedBtn || !copyAllBtn) {
    console.error("Setup error from listener.");
    if (uiMessage) uiMessage.textContent = "Error: Correct buttons are missing.";
    return;
  }

  exportSelectedBtn.addEventListener("click", () => handleExportClick("selected"));
  exportAllBtn.addEventListener("click", () => handleExportClick("all"));
  listenersAttached = true;
}

/**
* Listens from messages sent back from our content_script.
**/
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "EXPORT_RESULT") {
    if (message.status === 'success' && message.data) {
      try {
        // we can also disable buttons and delay on a given time.
        const filename = `eddm_export_${message.exportType || 'data'}_${new Date().toISOString().slice(0, 10)}.csv`;
        downloadCSV(message.data, filename); // Use enhanced download helper
        if (uiMessage) uiMessage.textContent = `Successfully exported ${filename}.`
        // if we window close, I suppose it's the extension only, or we can just disable the buttons, and give the user freedom.
      } catch (error) {
        if (uiMessage) uiMessage.textContent = `Download: failed: ${error.message} 93`;
      }
    } else {
      if (uiMessage) uiMessage.textContent = "Export failed: No data extracted or an error occurred on the page. :111";
    }
  }
  return false;
});

/**
* Init on popup by setting up listeners when DOM is loaded.
**/
document.addEventListener('DOMContentLoaded', setupListeners, { once: true });

// Giving this a try and see if it's helpful
if (uiMessage) {
    uiMessage.textContent = "Ready to export EDDM routes.";
}
