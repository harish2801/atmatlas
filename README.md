# ATM Atlas — Chennai Route Planner

A complete React + Tailwind CSS frontend and Node.js + Express backend, using a local JSON file as the database. Your supplied Lat_Long.xlsx is preloaded: 1,767 ATMs and 41 MSP–Bank pairs. Branch coordinates and ownership allocations are intentionally unset.

## Quick start on Windows

Install Node.js 22.12 or later. Extract this ZIP, open the `atm-route-planner` folder in VS Code and open Terminal.

```powershell
npm install
npm start
```

Open **http://localhost:5000**. The ZIP includes the compiled frontend, so the first start does not require a build. Alternatively, double-click `START_WINDOWS.bat`; it installs dependencies on first use and starts the application.

To run the server and client in separate terminals (your preferred setup):

Terminal 1:

```powershell
cd server
npm run dev
```

Terminal 2, starting in the project root:

```powershell
cd client
npm run dev
```

Open **http://localhost:5173** and keep both terminals running.

To start both together instead, run from the project root:

```powershell
npm run dev
```

Open **http://localhost:5173**. Vite proxies `/api` to Node on port 5000. After editing the frontend, run `npm run build` before using `npm start` again.

## First route plan

1. Open **Branches**. Enter the exact latitude and longitude of Ambattur and T Nagar; save each branch.
2. Open **MSP & bank allocation**. Assign all 41 combinations to AMB, TNG or BOTH, then click **Save allocations**. You can also import an allocation CSV or Excel file containing `MspACCOUNT`, `BANKCODE`, `Branch`. Branch accepts `AMB`, `AMBATTUR`, `TNG`, `TNAGAR`, `T Nagar`, `BOTH` or `Both branches`. A two-column upload adds MSP–Bank pairs without inventing ownership.
3. Open **ATM master** and filter **Invalid coordinates**. Correct these four ATMs, or mark them inactive if they should not be serviced:
   - S1BW000800002
   - 24105UHR
   - 00013HRY
   - 00014HRY
4. Click **Generate 45 routes**. Review feasibility. Use automatic branch route counts, or enter manual counts that add to 45 and fit branch capacity.
5. Open **Routes & stop order**. Select a route to see its numbered geographic plot and ordered stops. Export all route stops as CSV, or use **Print / PDF** to save the selected route with the browser's print dialog in A4 landscape.

## Capacity rules

- Only active ATMs are clustered.
- Exactly 45 routes are generated, with 35–40 ATMs each.
- This requires 1,575–1,800 active ATMs overall.
- Each branch must also satisfy `35 × branchRoutes <= allocatedActiveATMs <= 40 × branchRoutes`.
- Both allocations require valid coordinates for both branches. The allocation screen shows the saved ATM split per pair, and generation reports the number of shared ATMs assigned beyond their nearest branch for capacity. Manual branch route counts also recalculate the shared split.
- The automatic split chooses feasible branch counts totaling 45. An impossible allocation is reported rather than silently exceeding route limits or omitting ATMs.
- Each MSP–Bank pair can be allocated to Ambattur only, T Nagar only, or **Both branches**. Shared ATMs are initially assigned to their nearer branch. Only shared ATMs may be reassigned to satisfy 45 routes of 35–40 ATMs, using the smallest extra coordinate distance. Exclusive pairs never move. Every ATM belongs to one branch and one route; Both means eligibility for either branch, not duplicate servicing. The spreadsheet's HUBLOCATION remains source information.
- An ATM belongs to exactly one generated route. Inactive ATMs appear in the master but never in generated routes.

For example, 737 exclusively Ambattur ATMs and 1,030 exclusively T Nagar ATMs permit 19 + 26 routes. A fixed 20 + 25 split cannot hold 1,030 T Nagar ATMs. If at least 30 suitable ATMs are marked Both, the shared split may assign them to Ambattur to allow 20 + 25. This is an illustration, not a preconfigured branch allocation.

## Import and maintenance

The app supports XLSX, XLS and CSV (maximum 15 MB per upload). Required ATM headers:

```text
ATMID,MspACCOUNT,BANKCODE,LOCATION,HUBLOCATION,SUBLOCATION,ATMTYPE,CASHLOADINGMETHOD,ROUTE,Longitude,Latitude
```

- The matching worksheet is detected by its headers. Your supplied workbook has the ATM master in Sheet1 and MSP–Bank pairs in Sheet2.
- Keep ATMID as spreadsheet **Text** to preserve leading zeroes. Numeric cells are converted to strings, but lost leading zeroes cannot be reconstructed.
- Merge adds or updates ATMs by ATMID; Replace removes existing ATMs absent from the new file.
- Duplicate ATM IDs or missing ATMID/MSP/Bank reject the entire import. No partial database changes occur.
- Missing or invalid coordinates can be imported and edited later. Active coordinate issues block route generation. Coordinates must lie within latitude −90…90 and longitude −180…180; 0,0 is rejected. Range-valid points are not guaranteed to represent the intended site.
- Optional `active` or `STATUS` accepts FALSE, 0, INACTIVE or NO to exclude an ATM; omission defaults to active. An import overwrites imported rows' active status, so include this column when preserving exclusions.
- Add/Edit/Delete and Active/Inactive controls are available in the master.
- Generated route codes are stored separately (for example, CHE_AMB_01 and CHE_TNG_01). The original ROUTE field is preserved.
- Changes to ATMs, branches or allocations mark routes stale. Regenerate before exporting or printing.
- Map links open a single ATM in Google Maps. The built-in plot works without a map API key and has no street basemap.

## Clustering and stop order

Balanced recursive geographic bisection assigns exact route sizes; capacity-preserving swaps improve spatial compactness. Clusters are independent within each branch. Coordinates are compared using Haversine distance.

Stop order starts at the branch, applies nearest-neighbor selection, then improves the sequence with 2-opt. The optional return-to-branch setting includes the final return leg in the reported distance. Each route lists stop number, ATM ID, MSP, bank, location, leg distance and cumulative distance.

**Distances are straight-line geographic estimates, not road distances or traffic times.** This is a heuristic route plan, not a guaranteed globally optimal road itinerary. Review road access, crossing points, service hours and security constraints operationally. A road-routing provider would be a separate integration.

## JSON persistence

- `server/index.js` is the Express entry file.
- `server/data/db.json` is the working database: ATMs, two branches, allocations, settings, routes and generated per-ATM branch assignments.
- `server/data/seed.json` is the original normalized seed. If db.json is missing, startup creates it from the seed.
- Writes are serialized within one Node process, written to a temporary file and atomically renamed. `server/data/backups/previous.json` retains the immediately previous successful state.
- Revision checks prevent one browser window from overwriting another window's successful update. Refresh after a revision conflict.
- **Download JSON backup** exports the complete current database. To restore, stop Node, replace `server/data/db.json` with your backup JSON, and restart. Keep a copy of the current file before restoring.
- Run one Node process against the JSON file. This database does not coordinate writes from multiple Node instances.
- This deliverable runs on localhost. If deploying elsewhere, the server needs a persistent writable disk for its JSON data.

Optional environment variables: `PORT` (default 5000), `HOST` (default 127.0.0.1), `ATM_DB_PATH` (absolute database path). No `.env` file or MongoDB credentials are required.

## Project structure

```text
client/src/main.jsx       React screens and forms
client/src/style.css      Tailwind import, responsive styling and print layout
client/vite.config.js     Vite, React, Tailwind and API proxy
client/dist/              Compiled production frontend
server/index.js           Express API and static frontend serving
server/planner.js         Validation, feasibility, clustering and stop ordering
server/store.js           Serialized JSON persistence and revision protection
server/data/              Working database and original seed
sample/Lat_Long.xlsx      Your original uploaded workbook
sample/*-template.csv     Import header templates
sample/coordinate-issues.csv  Four missing-coordinate records
tests/                   Algorithm and API integration tests
```

## Validation

```powershell
npm test
npm run build
```

Tests cover capacity boundaries, every-ATM-once assignment, branch ownership, Both branch splitting, capacity rebalancing, fixed-pair protection, invalid/unallocated data, inactive exclusion, stop ordering, the supplied workbook, transactional import rejection, persistence, backups and revision conflicts. Browser visual QA could not be run in the build environment; the production build and API/algorithm tests were run.
