# Update: MSP–Bank allocation to Both branches

This update package contains no database files. Your current ATMs, branch coordinates and allocations are preserved.

1. Stop the server and client terminals with Ctrl+C.
2. Copy the contents of the `atm-route-planner` folder in this ZIP into your existing project folder and replace the matching files. Do not rename your project folder. No npm install is needed; dependencies have not changed.
3. Restart in separate terminals:

Terminal 1, from your project root:

```powershell
cd server
npm run dev
```

Terminal 2, from your project root:

```powershell
cd client
npm run dev
```

Open http://localhost:5173.

4. Open **MSP & bank allocation**. The dropdown now offers **Ambattur**, **T Nagar** and **Both branches**. Select Both for the appropriate pairs, then click **Save allocations**.
5. Ensure both branch coordinates are set. The saved ATM split columns show how many active ATMs for each pair are assigned to each branch.
6. Generate routes again. Shared ATMs use distance to the two branches, with capacity balancing as required for 45 routes of 35–40 ATMs. Exclusive pairs remain with their chosen branch. An ATM is never duplicated between branches.

CSV and Excel allocation imports accept `BOTH` or `Both branches` in the Branch column.

The ZIP also contains the compiled frontend for `npm start` users. The three application source files changed are `server/planner.js`, `server/index.js` and `client/src/main.jsx`. Updated tests and documentation are included.
