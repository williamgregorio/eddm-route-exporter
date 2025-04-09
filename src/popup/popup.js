import { downloadCSV } from './download.js';

function setupListeners() {
  const exportSelectedBtn = document.getElementById("exportSelectedBtn");
  const exportAllBtn = document.getElementById("exportAllBtn");

  if (!exportSelectedBtn || !exportAllBtn) {
    console.error("On setup from listener, buttons are missing!.");
    return;
  }

  async function handleExportClick(exportType) {
    console.log(`Popup: handleExportClick called for type: ${exportType}`);
    try {
      // active tab query
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tabs || tabs.length === 0 || !tabs[0]?.id) {
        console.error("Popup error: Could not get active tab information.");
        alert("Error: Could not identify the active tab. Please ensure you are on the USPS EDDM page and try again.");
        return;
      }
      const activeTab = tabs[0];
      console.log(`Popup: Active tab found: ${activeTab.id}`);

      // we can also place for local developer if needed
      /**
      if (!activeTab.url || !activeTab.url.includes('eddm.usps.com')) {
        console.warn("Popup warning: Not on eddm.usps.com");
        alert("Please navigate to the USPS EDDM route selection page on eddm.usps.com before exporting.");
        return;
      }**/

      // injecting content before
      console.log(`Popup: Injecting content_script.bundle.js into tab ${activeTab.id}`);
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: ['content_script.bundle.js']
      },
      // handle the injection callback (IMPORTANT for injection errors)
      (injectionResults) => {
        // chrome.runtime.lastError
        if (chrome.runtime.lastError) {
          console.error(`Popup: Script injection failed for tab ${activeTab.id}:`, chrome.runtime.lastError);
          alert(`Error injecting script: ${chrome.runtime.lastError.message}\n\nPlease reload the EDDM page and the extension.`);
          return;
        }

        // does results array exists? (it should, even if empty)
        if (!injectionResults) {
          console.error("Popup: Injection callback executed, but no results Array received.");
          alert("An unexpected issue occurred during script injection (no results []). Please try again.");
          return;
        }

        console.log("Popup: Injection seemingly successful. Sending command...");
        // sends command message to the expected injected script
        chrome.tabs.sendMessage(activeTab.id, {
          action: "EXPORT_COMMAND",
          exportType: exportType
        }, (response) => {
          // relies chrome.runtime.sendMessage separate
          if (chrome.runtime.lastError) {
            // indicates the content script's listener wasn't ready or didn't exist
            console.warn(`Popup: Error sending message to tab ${activeTab.id} (content script might not be listening):`, chrome.runtime.lastError);
            // no need to alert since the separate EXPORT_RESULT listener handles success/failure data
          } else {
            console.log("Popup: Command message sent successfully.");
          }
        });
      });

    } catch (error) {
      // unexpected errors during async operations (e.g tabs.query) or synchronous
      console.error(`Popup Error processing export ${exportType}:`, error);
      alert(`An unexpected error occurred: ${error.message}`);
    }
  }

  exportSelectedBtn.addEventListener("click", () => handleExportClick("selected"));
  exportAllBtn.addEventListener("click", () => handleExportClick("all"));
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "EXPORT_RESULT") {
    console.log("Popup: Received export result", message);
    if (message.status === 'success' && message.data) {
      const filename = `eddm_export_${message.exportType || 'data'}_${new Date().toISOString().slice(0, 10)}.csv`; // Maybe pass exportType back
      downloadCSV(message.data, filename); // Use enhanced download helper
    } else {
      console.warn("Popup: Export failed or no data returned from content script.");
      // UI feedback could go here if needed, but alerts were called in content script.
    }
  }
  return false;
});


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupListeners);
} else {
  setupListeners();
}
