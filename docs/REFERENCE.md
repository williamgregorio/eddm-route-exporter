# USPS EDDM Table DOM Structure Reference
### Date: April 9, 2025

## Purpose:
This document should explain the HTML data structure of this date, founded on [eddm.usps.com](https://eddm.usps.com).

**Note**: A user may choose between residential and business or just residential, the code is able to adapt to such changes.

1. **Main table container**:
- Selector: table.target-audience-table
  - (Also has class col-12, but target-audience-table seems more specific)
- Simple structure: Standard HTML table containing one <thead> and one <tbody> element.
- Code reference: Targeted by document.querySelector('table.target-audience-table').
