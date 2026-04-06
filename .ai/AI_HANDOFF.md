# AI Handoff
Current Task: Rewrite `scraper.ts` to use GET requests for MyBB search logic, and change `userId` logic to `username` text.

## Context
- The user provided manual HTTP headers from `barcross.ru` showing the search endpoint works directly via GET query parameters: `search.php?action=search&author=Varka&forum=10&search_in=0&sort_by=0&sort_dir=DESC&show_as=posts`.
- The previous implementation used POST formData and `userId`, which fails MyBB validation due to CSRF tokens and type mismatch (author expects string nick, not ID).
- We also lack `credentials: 'same-origin'` or `'include'` so we aren't using session cookies. 
- I am updating `ui/form.ts` to ask for Nickname instead of ID.
- I am updating `scraper.ts` to construct the GET URLSearchParams, use `credentials: 'same-origin'`, and properly fetch paginated links.

## Files Modified
- `plugin/src/ui/form.ts`
- `plugin/src/scraper/scraper.ts`
