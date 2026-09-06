# PulseBoard Web

React client for the PulseBoard API. It is a working product UI *and* a test
harness: every request the app makes is captured in a dev panel showing method,
URL, status, timing, request body, and response body.

## Running

The API must be running first (from the repo root):

```bash
npm run dev
```

Then, in this directory:

```bash
npm install && npm run dev
```

The client reads `VITE_API_BASE_URL` from `.env` (copy `.env.example`); it
defaults to `http://localhost:3000/api/v1`.

The API's CORS origin and rate limit are configurable from the root `.env`:

```
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_MAX=2000
```

The default rate limit of 100 requests / 15 min is easy to trip from a browser
session, hence the raised dev value.

## Dev panel

Toggle with the **API log** pill (bottom right) or `Ctrl` + `` ` ``. It shows the
last 50 requests, the signed-in user, a live countdown on the 1-hour JWT, and
lets you copy any request as a curl command.

## Structure

```
src/
  app/store.js          Redux store
  services/
    baseQuery.js        auth header, {success,data} unwrapping, 401 handling, dev-log tap
    api.js              single RTK Query slice
    endpoints/          one module per resource
  features/             auth, projects, tasks, comments, attachments, members, devtools
  components/ui/        Button, Field, Modal, Card, Badge, Avatar, Toaster, Spinner
  components/layout/    AppShell, Topbar, Logo, PageHeader
  hooks/                useAuth, useProjectRole, useToast
  lib/                  constants, jwt, download, format, cn
  styles/index.css      Tailwind v4 theme tokens
```

Conventions:

- No component calls `fetch` directly — everything goes through `services/`.
  The one exception is `lib/download.js`, which needs a raw binary response.
- Domain strings (`Pending`/`In Progress`/`Completed`, `Admin`/`Member`, upload
  limits) live only in `lib/constants.js`, mirrored from the DB CHECK
  constraints in `migrations/`.
- Colours are defined once in `styles/index.css` as `@theme` tokens.

## Notes on the API this client talks to

Things the UI works around rather than fixes:

- **No `/auth/me`.** The user id is decoded from the JWT payload, then the
  profile is fetched from `GET /users/:userId`.
- **Signup returns no token**, so the signup screen chains a login call.
- **No PATCH for tasks.** `updateTaskSchema` requires title and status, so
  moving a card resends the whole task.
- **No pagination totals.** `GET /projects` and `GET /users` return bare arrays,
  so "has next page" is inferred from a full page of results.
- **`createProject` / `createTask` / `createComment` require a `userId` in the
  body** even though the server uses the JWT for ownership; the client sends its
  own id to satisfy validation.
- **Comment edit/delete is open to any project member** server-side. The UI only
  shows those controls to the author — see item 1 in `future_scope.md`.
