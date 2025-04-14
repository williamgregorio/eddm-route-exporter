import { scrapeAndExport } from './logic.js';
let hasListener = false;

if (!hasListener) {
  hasListener = true;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "PING") {
      sendResponse({ status: "PONG" });
      // indication of will to sendResponse async.
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
    return undefined; // I say it's fine, since it speaks for itself.
  });

  console.log("Listening...");
} else {
  console.log("Already listening. (30)");
}

console.log("Done: Process has been executed.");
