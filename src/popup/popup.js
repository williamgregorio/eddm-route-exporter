import { downloadCSV } from './download.js';
const uiMessage = document.querySelector("#message");
let listenersAttached = false;

function setupListeners() {
  if (listenersAttached) return;
  listenersAttached = true;

  const exportSelectedBtn = document.getElementById("exportSelectedBtn");
  const exportAllBtn = document.getElementById("exportAllBtn");

  if (!exportSelectedBtn || !exportAllBtn) {
    console.error("On setup from listener, buttons are missing!.");
    return;
  }

  async function handleExportClick(exportType) {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tabs || tabs.length === 0 || !tabs[0]?.id) {
        uiMessage.textContent += "Error: Could not identify the active tab. Please ensure you are on the USPS EDDM page and try again.";
        return;
      }
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {
        action: "EXPORT_TYPE",
        exportType: exportType
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn(`chrome.tabs.sendMessage(): Error sending message:`, chrome.runtime.lastError.message);
        } else {
          console.log("chrome.tabs.sendMessage(): Message sent successfully.");
          uiMessage.textContent += "Message sent successfully. action: EXPORT_TYPE <- Please catch it."
        }
      });
    } catch (error) {
      console.error(`Error: Processing export ${exportType} most likely type is wrong:`, error);
      alert(`An unexpected error occurred: ${error.message}`);
    }
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
