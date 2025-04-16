import { downloadCSV } from './download.js';
const uiMessage = document.querySelector("#message");
let listenersAttached = false;

/**
* Handles the exporting process when clicked.
* Checks response before sending EXPORT_COMMAND
* @param {string} exportType - selected, all, copySelected, copyAll
**/
async function handleExportClick(exportType) {
  if (uiMessage) uiMessage.textContent = `Checking page readiness...`;
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
      if (uiMessage) uiMessage.textContent = `Please search for routes in the EDDM Search for Routes input.`;
    } catch (error) {
      console.error("Error occurred during PING:", error);
      if (error.message.includes("Receiving end does not exist")) {
        throw new Error("Cannot get routes on EDDM page. Please search for a route.");
      } else {
        throw new Error(`Connection error: ${error.message}`);
      }
    }

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
        }
      });
  } catch (error) {
    console.error(`Error: Processing ${exportType}:`, error);
    if (uiMessage) uiMessage.textContent = `Error: ${error.message}`;
  }
}

/**
*
* Setup for event listeners on buttons.
*/
function setupListeners() {
  if (listenersAttached){
    return;
  };

  const exportSelectedBtn = document.getElementById("exportSelectedBtn");
  const copySelectedBtn = document.getElementById("copySelectedBtn");
  const exportAllBtn = document.getElementById("exportAllBtn");
  const copyAllBtn = document.getElementById("copyAllBtn")

  if (!exportSelectedBtn || !exportAllBtn || !copySelectedBtn || !copyAllBtn) {
    console.error("Setup error from listener.");
    if (uiMessage) uiMessage.textContent = "Error: Correct buttons are missing.";
    return;
  }

  exportSelectedBtn.addEventListener("click", () => handleExportClick("selected"));
  copySelectedBtn.addEventListener("click",() => handleExportClick("copySelected"));
  exportAllBtn.addEventListener("click", () => handleExportClick("all"));
  copyAllBtn.addEventListener("click", () => handleExportClick("copyAll"));
  listenersAttached = true;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log("Copied to clipboard!");
  }).catch(err => {
    console.error("Failed to copy:", err);
  });
}

/**
* Listens from messages sent back from our content_script.
**/
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "EXPORT_RESULT") {
    if (message.status === 'success' && message.data) {
      const filename = `eddm_export_${message.exportType || 'data'}_${new Date().toISOString().slice(0, 10)}.csv`;
      try {
        if (message.exportType === "all" || message.exportType === "selected") {
          downloadCSV(message.data, filename);
          if (uiMessage) uiMessage.textContent = `Downloaded: ${filename}`;
        } else if (message.exportType === "copyAll" || message.exportType === "copySelected") {
          copyToClipboard(message.data);
          if (uiMessage) uiMessage.textContent = `Copied ${message.exportType === "copyAll" ? "all" : "selected"} to clipboard.`;
        } else {
          if (uiMessage) uiMessage.textContent = `Please select an option.`;
        }
      } catch (error) {
        if (uiMessage) uiMessage.textContent = `Download: failed: ${error.message}`;
      }
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
  uiMessage.textContent = "Ready to export or copy EDDM routes.";
}
