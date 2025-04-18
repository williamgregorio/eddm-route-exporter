# USPS EDDM Route Exporter Chrome Extension <img src="https://github.com/williamgregorio/eddm-route-exporter/blob/main/assets/eddm-exporter-extension-icon-0.2.0.png" width="116" height="116" alt="icon for eddm route exporter" />

## Tool purpose:
Saves you time by exporting route data from eddm.usps.com into a csv format.


## eddm.usps.com - Standard feature actions
- For the input **"Search for Routes"**, you can add multiple zip codes with comma separation.
```bash
e.g 12354,12345,etc
```
- In the table header by **"Target Audience"** and viewing as **"Map"** you may select business and residential or residential only routes.
- In the table header you may select type of routes when viewing as **"Map"** with options like: (**else all is default**):
  - (checkbox) City
  - (checkbox) Rural/Highway
  - (checkbox) PO Box™

## Goals:
- ~~Construct headers based on theader for accurate export on selection regardless on standard feature type~~.
- ~~Start for all rows as default export button with no selection context.~~
- ~~Iterate cells on selected for check bool and pass it ova to the next function.~~
- Need to create ui messaging on click, to much access for the user.
- Construct from data parse, headers from body, return sortations, and selection on best routes


## Current:
[x] - copyAll works
[x] - copySelected works
