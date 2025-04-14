import { downloadCSV } from './download.js';
const uiMessage = document.querySelector("#message");
let listenersAttached = false;

/**
* Handles the exporting process when clicked.
* Checks response before sending EXPORT_COMMAND
* @param {string} exportType - selected or all
**/
async function handleExportClick(exportType) {
  if (uiMessage) uiMessage.textContent = `Starting export: ${exportType}...`;

  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

    if (chrome.runtime.lastError) {
      throw new Error(`Query error: ${chrome.runtime.lastError.message}`);
    }

    if (!tabs || tabs.length === 0 || !tabs[0]?.id) {
      throw new Error("Could not identify active tab.");
    }

    const activeTab = tabs[0];
    const activeTabId = activeTab.id;
    console.log(`Dev::Active tab found. ID: ${activeTabId}, URL: ${activeTab.url}`);

    try {
      const response = await chrome.tabs.sendMessage(activeTabId, { action: "PING" });

      if (response?.status !== "PONG") {
        console.error("Ping check failed: Invalid response received:", response);
        throw new Error("Page script didn't respond correctly. Try reloading the page.");
      }
      console.log("Pong aware, content script confirmed and ready.");

    } catch (pingError) {
      console.error("Error occurred during PING:", pingError);
      if (pingError.message.includes("Receiving end does not exist")) {
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
    alert(`An unexpected error occurred: ${error.message}`);
  }
}

function setupListeners() {
  if (listenersAttached) return;
  listenersAttached = true;

  const exportSelectedBtn = document.getElementById("exportSelectedBtn");
  const exportAllBtn = document.getElementById("exportAllBtn");

  if (!exportSelectedBtn || !exportAllBtn) {
    console.error("On setup from listener, buttons are missing!.");
    return;
  }

  exportSelectedBtn.addEventListener("click", () => handleExportClick("selected"));
  exportAllBtn.addEventListener("click", () => handleExportClick("all"));
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "EXPORT_RESULT") {
    uiMessage.textContent += `Popup chrome.runtime.onMessage() -> message.action: Received export result ${message}`;
    if (message.status === 'success' && message.data) {
      const filename = `eddm_export_${message.exportType || 'data'}_${new Date().toISOString().slice(0, 10)}.csv`;
      console.log(message.data);
      downloadCSV(message.data, filename); // Use enhanced download helper
    } else {
      uiMessage.textContent += "Export failed or no data has been returned from your content script.";
    }
  }
  return false;
});

document.addEventListener('DOMContentLoaded', setupListeners, { once: true });
