import { scrapeAndExport } from './logic.js';

let hasListener = false;

if (!hasListener) {
  hasListener = true;
  console.log("Content script (bundled): Loaded and listener will be added.");
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Content script (bundled): Message received", message);
    if (message.action === "EXPORT_TYPE") {
      const exportType = message.exportType;
      console.log(`Content script (bundled): Received EXPORT_COMMAND for type: ${exportType}`);
      const csvString = scrapeAndExport(exportType);
      chrome.runtime.sendMessage({
        action: "EXPORT_RESULT",
        status: csvString ? 'success' : 'failure',
        data: csvString,
        exportType: exportType
      });
    }
    return false; // message port open for async responses
  });
} else {
  console.log("Content script (bundled): Listener already active.");
}

console.log("Content script (bundled): Script executed.");
