# USPS EDDM Route Exporter Chrome Extension

## Tool description:
Saves time, by exporting route data from eddm.usps.com into a csv format.


## eddm.usps.com
For the input **"Search for Routes"**, you can add multiple zip codes with comma separation.
```bash
e.g 12354,12345,etc
```

## Analysis:
- table selection (object) : .target-audience-table
- table selection (object).children[0] : thead>tr>
  - ```html
  <html>table code test</html>
  ```
- table selection (object).children[1] : body
