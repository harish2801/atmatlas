# Render Free demo deployment

The current application can host the compiled React frontend and Node API in one Render Web Service. Separate terminals remain your local development setup; the deployed application uses one public URL.

## Prepare GitHub

1. Copy render.yaml and this guide into your project root (next to package.json).
2. Push the complete project to a GitHub repository, preferably private. The repository must include client/, server/, package.json, package-lock.json and server/data/seed.json. Do not upload node_modules.
3. The existing .gitignore excludes server/data/db.json, which is the local working database, and client/dist, which Render builds. The seed.json file must be committed so Render can create its initial database.
4. To start the demo with your current local branch coordinates and allocations, stop the local server and intentionally copy your current database to the seed before committing:

```powershell
Copy-Item server/data/db.json server/data/seed.json
```

Only do this if those are the records you want online. Preserve a copy of the original seed first if needed. Changes saved in the online demo do not write back to GitHub.

## Create the service manually

Open https://dashboard.render.com, choose New > Web Service, connect GitHub and select your project repository.

- Name: atm-atlas-chennai-demo (or another available name)
- Language/runtime: Node
- Branch: your repository's project branch
- Root Directory: blank if client/, server/ and package.json are at repository root. If these are inside an atm-route-planner/ subfolder, enter atm-route-planner instead.
- Build Command: npm ci --include=dev && npm run build
- Start Command: npm start
- Instance Type: Free

Environment variables:

```text
NODE_ENV=production
NODE_VERSION=22.22.0
HOST=0.0.0.0
```

Do not set PORT manually; the backend already reads Render's PORT. No VITE_API_URL or MongoDB settings are needed: frontend requests use the same origin's /api path.

Click Deploy Web Service. Wait for the build and startup to finish, then open the URL Render returns. No deployed URL has been created by this package.

Alternatively, create a Render Blueprint from the repository-root render.yaml. Use the manual setup if the project is in a repository subfolder, since this manifest assumes a project-root repository.

## Demo behavior

Render Free spins down after 15 minutes of inactivity. Waking can take about one minute. Local file changes are lost when a Free service spins down, restarts or redeploys. That includes ATM imports, edits, allocations and generated routes. Startup recreates the database from the committed seed.json.

Use Download JSON backup to save work before leaving a demo session. This does not make the online filesystem persistent.

This application currently has no login. Anyone able to reach the demo URL can access the ATM records and edit the demo. A private GitHub repository hides the source; it does not restrict the web application's visitors. Use a demo dataset if that access is unsuitable for your operational records.

## Troubleshooting

- No open port / deployment timeout: confirm HOST=0.0.0.0. The server's localhost default is intended for local use.
- Missing package.json or npm ci failure: check Root Directory and ensure the workspace package files and lockfile are committed.
- Tailwind/Vite missing: keep --include=dev in the build command.
- Missing seed.json: commit server/data/seed.json.
- Blank / stale frontend: ensure build command includes npm run build.
- Data reset: expected on Free with a local JSON database.

Official documentation:
https://render.com/docs/deploy-node-express-app
https://render.com/docs/node-version
https://render.com/docs/free
