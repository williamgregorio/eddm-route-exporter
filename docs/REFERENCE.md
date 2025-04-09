# USPS EDDM Table DOM Structure Reference
### Date: April 9, 2025

## Purpose:
This document should explain the HTML data structure of this date, founded on [eddm.usps.com](https://eddm.usps.com).

**Note**: A user may choose between residential and business or just residential, the code is able to adapt to such changes.

1. **Main table container**:

    - **Selector**: `table.target-audience-table`
      - Also has class `col-12`, but target-audience-table seems more specific
    - **Structure**: Standard HTML table containing one `<thead>` and one `<tbody>` element.
    - **Code reference**: Targeted by `document.querySelector('table.target-audience-table')`.

2. **Table header** (`<thead>`)

    - **Structure**: Contains a single header row (`<tr>`).
    - **Header row selector**: `tr.target-audience-table-header`
    - **Header cells** (`<th>` within the header row):
        - `<th>[0]` (index 0): Select all checkbox
            - Contains: `label > input#select-all-checkboxes`
            - Purpose: UI element for selecting/deselecting all rows.
            - Logic: IGNORED when extracting column header titles.
        - `<th>[1]` onwards: Data column headers
            - Contains: Typically an `<a>` tag holding the column title text (e.g., "Route", "Residential", "Business", "Total", "Age...", "Size", "Income", "Cost"). May contain other elements like `<img>` (sort icons) or `<span>` (age range).
            - Purpose: Defines the meaning of the data in the corresponding column below.
            - Logic: Select all `thead th`, skip the first one (`.slice(1)`), then extract text using `th.textContent.replace(/\s+/g, ' ').trim()` to get the clean header title.
            - **Note**: The `<th>` containing "Business" (identified by `id="businessTableHeader"`) may be absent in the "Residential Only" view. The logic dynamically counts the present headers.


3. **Table body** (`<tbody>`)

  - Structure: Contains multiple table rows (<tr>), each representing a specific EDDM route.

4. **Data rows** (`<tr>`)

  - **Selector**: `tr.list-items` within the `<tbody>`
    - Also has `valign="top"` attribute "SOME WILL BE EMPTY"
  - **Structure**: Each row contains multiple table data cells `<td>`.

5. **Data cells**  (`<td> within tr.list-items`)

  - **`<td>[0] (index 0)`**: Row selection checkbox
    - **Contains**: `label > input.routeChex` (Class routeChex is key). The input also has `data-route-info` and id attributes specific to the route.
  - **Purpose**: Allows user selection of individual rows. Its checked status determines if the row is exported in "Export Selected" mode.
  - **Logic**: IGNORED when extracting data values for the CSV columns. Checked status read via `row.querySelector('td:first-child input.routeChex')?.checked`.
