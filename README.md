# USPS EDDM Route Exporter Chrome Extension

## Tool description:
Saves time, by exporting route data from eddm.usps.com into a csv format.


## eddm.usps.com - Standard features
- For the input **"Search for Routes"**, you can add multiple zip codes with comma separation.
```bash
e.g 12354,12345,etc
```
- In the table header by **"Target Audience"** and viewing as **"Map"** you may select business and residential or residential only routes.
- In the table header you may select type of routes when viewing as **"Map"** with options like else all is default:
  - (checkbox) City
  - (checkbox) Rural/Highway
  - (checkbox) PO Box™

## Goals:
- For cost turn string to number(js)

## Analysis:
- **table** ~ (object) =:> .target-audience-table
- table.children[0] = thead>tr>
```html
<thead>
  <tr class="target-audience-table-header">
    <th class="text-right">
      <label class="checkbox-component">
        <input type="checkbox" id="select-all-checkboxes">
        <span class="checkbox"></span>
      </label>
    </th>
    <th class="text-left"><a class="inline-link normal sort-route" href="#" aria-label="Sort column order by Route">Route <img src="images/sort-icon.svg" alt="Sort icon"></a></th>
    <th><a class="inline-link normal sort-residential" href="#" aria-label="Sort column order by Residential">Residential <img src="images/sort-icon.svg" alt="Sort icon"></a></th>
    <th id="businessTableHeader"><a class="inline-link normal sort-business" href="#" aria-label="Sort column order by Business">Business <img src="images/sort-icon.svg" alt="Sort icon"></a></th>
    <th>Total </th>
    <th class=""><a class="inline-link normal sort-age" href="#" aria-label="Sort column order by Age">Age: <span id="lowerAgeTable">25</span>-<span id="upperAgeTable">34</span> <img src="images/sort-icon.svg" alt="Sort icon"></a></th>
    <th class=""><a class="inline-link normal sort-size" href="#" aria-label="Sort column order by Size">Size <img src="images/sort-icon.svg" alt="Sort icon"></a></th>
    <th class=""><a class="inline-link normal sort-income" href="#" aria-label="Sort column order by Income">Income <img src="images/sort-icon.svg" alt="Sort icon"></a></th>
    <th>Cost </th>
  </tr>
</thead>
```
- table selection (object).children[1] : body
