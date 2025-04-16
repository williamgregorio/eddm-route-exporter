import { scrapeAndExport } from './logic.js';
let hasListener = false;

if (!hasListener) {
  hasListener = true;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "PING") {
      sendResponse({ status: "PING" });
      return true;
    }

    if (message.action === "EXPORT_TYPE") {
      const exportType = message.exportType;
      const csvString = scrapeAndExport(exportType);
      chrome.runtime.sendMessage({
        action: "EXPORT_RESULT",
        status: csvString ? 'success' : 'failure',
        data: csvString,
        exportType: exportType
      });
      return false;
    }
    return undefined;
  });
} else {
}
