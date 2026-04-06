# Current AI State

- Owner: Antigravity (Google Deepmind)
- Updated: 2026-04-06
- Task: BarCrosser Tampermonkey scraper refactor to use GET requests for MyBB search (fixing CSRF / IP Ban / Author ID issues).
- Status: in progress
- Next step: The user requested an update to `scraper.ts` to perform a GET request (like `search.php?action=search&author=Varka...`) instead of POST, with pagination and `credentials: 'same-origin'`. The UI must be updated to request `username` instead of `userId`.
- Last change: Identified why the current POST approach will fail on mybb.ru (requires username not numeric ID, CSRF formhash on POSTs, missing session cookies). Handoff initiated by User request to avoid hitting limits.
