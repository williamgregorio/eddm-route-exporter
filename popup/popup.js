import { downloadCSV } from './download.js';

// main logic - check reference
// make sure button name convention matches else this will fail
function main() {
  document.getElementById("exportSelectedBtn").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scrapeAndExport,
      args: ['selected']
    });
  });

  document.getElementById("exportAllBtn").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scrapeAndExport,
      args: ['all']
    });
  });

}

main();
