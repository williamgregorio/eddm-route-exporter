# USPS EDDM Route Exporter Chrome Extension <img src="https://github.com/williamgregorio/eddm-route-exporter/blob/main/assets/eddm-exporter-extension-icon.png" width="128" height="128" alt="icon for eddm route exporter" />

## Tool description:
Saves time, by exporting route data from eddm.usps.com into a csv format.


## eddm.usps.com - Standard features
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
- For total cost turn string(pop>char[$]) to number type(js).
- Construct headers based on theader for accurate export on selection regardless on standard feature type.
- Start for all rows as default export button with no selection context.
- Iterate cells on selected for check bool and pass it ova to the next function.

## Analysis:
- **table** ~ (object) =:> .target-audience-table
- table.children[0] = thead>tr> (Default else when using standard features, some will pop like Residential or Business)
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
- table.children[1] = tbody>tr (some trs have nothing, you must check when empty and skip)
- table.children[1].children[100].children[0].children[0].children[0].checked (after selecting a tr, you have to go deeper to reach element)
