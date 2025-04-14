(()=>{"use strict";const e="table.target-audience-table";let t=!1;t||(t=!0,chrome.runtime.onMessage.addListener(((t,r,o)=>{if("PING"===t.action)return o({status:"PING"}),!0;if("EXPORT_TYPE"===t.action){const r=t.exportType,o=function(t){const r=function(t){const r=document.querySelectorAll(`${e} tbody`);if(!r||0===r.length)return console.error("getRowsToExport: Could not find table body."),alert("Alert: Could not find a valid table."),null;const o=r[0].querySelectorAll("tr.list-items");if("selected"===t){const e=Array.from(o).filter((e=>{const t=e.querySelector("td:first-child input.routeChex");return t&&t.checked}));return 0===e.length?(console.warn("Export: No rows selected."),alert("No routes are currently selected. Please check the boxes next to the routes you want to export."),null):e}return 0===o.length?(console.warn("Export: No rows found in the table"),alert("No route data rows found in the table."),null):o}(t);if(!r)return null;const o=function(t){const r=[],o=document.querySelector(e);if(!o)return console.error("extractDataFromRows: Could not find table."),[];const n=o.querySelectorAll("thead th");if(n.length>1){const e=Array.from(n).slice(1).map((e=>e.textContent.replace(/\s+/g," ").trim()));r.push(e)}else console.warn("Export: Could not find enough header cells.");return Array.from(t).forEach((e=>{const t=e.querySelectorAll("td");if(!(t.length>2))return null;{const e=r[0]?.length||t.length-2,o=Array.from(t).slice(1,1+e).map((e=>e.textContent.trim()));r.push(o)}})),r}(r);return o.length<=1?(console.warn("Export: No data extracted or only headers found."),null):o.map((e=>e.map((e=>{const t=e.replace(/"/g,'""');return t.includes(",")||t.includes('"')||t.includes("\n")?`"${t}"`:t})).join(","))).join("\n")}(r);return chrome.runtime.sendMessage({action:"EXPORT_RESULT",status:o?"success":"failure",data:o,exportType:r}),!1}})))})();