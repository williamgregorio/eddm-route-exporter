import { scrapeAndExport } from './logic.js';

// listen for messages SENT FROM THE POPUP (chrome.tabs.sendMessage)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Content script (bundled): Message received", message);

  if (message.action === "EXPORT_COMMAND") {
    const exportType = message.exportType; // 'selected' or 'all' only
    console.log(`Content script (bundled): Received EXPORT_COMMAND for type: ${exportType}`);
    const csvString = scrapeAndExport(exportType);

    // data type can return null
    chrome.runtime.sendMessage({
      action: "EXPORT_RESULT",
      status: csvString ? 'success' : 'failure',
      data: csvString,
      exportType: exportType
    });
  }
  return false;
});

console.log("Content script (bundled): Loaded and listener has been added.");
