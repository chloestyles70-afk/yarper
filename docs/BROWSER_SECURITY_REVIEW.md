# Yarper — Ownership and Browser-Security Source Review

**Review date:** 4 November 2026  
**Scope:** Repository history metadata, tracked asset inventory, licence notices, HTML/JavaScript rendering sinks and XSS regression checks.  
**Limit:** This is a source and repository-metadata review. It is not legal proof of ownership, a live browser test, a penetration test or an independent security assessment.

## 1. Ownership evidence reviewed

- The GitHub commit API returned 133 commit records across two pages (100 + 33), spanning 19 September 2026 through 4 November 2026.
- All 133 records identify the same GitHub author account, `chloestyles70-afk`; no second author account appeared in the returned commit history.
- The returned commit metadata marks signatures as unverified/unsigned. Commit attribution to one account is useful provenance evidence, but it does not prove who physically wrote the code or created each asset.
- The separate GitHub contributors endpoint was not available through the connected repository interface, so no independent contributors-list result is claimed.
- The owner previously reported that no other person contributed code, design, icon or game content. This remains an owner statement, not an independently verified fact.
- The proprietary `LICENSE.md` reserves rights but does not identify a named rights holder or establish authorship.

## 2. Tracked asset inventory

The complete recursive Git tree was inspected (GitHub reported `truncated=false`). It contains the production single-page app, concept and studio HTML prototypes, `icon.svg`, manifest, Edge Function, migrations, tests and documentation.

No raster image, audio, video, font binary or vendored third-party asset file appears in the tracked tree. The production source names Inter with system-font fallbacks; no font file or remote font stylesheet was identified in the reviewed HTML. The Edge Function imports Supabase JS `2.118.0` from esm.sh and the Supabase Edge Runtime type declaration; those remain third-party runtime/library dependencies governed by their own terms.

### Asset-specific status

| Item | Review result | Remaining evidence |
|---|---|---|
| App icon (`icon.svg`) | One SVG icon is tracked; it is vector artwork created from SVG paths/gradients. | Owner must confirm authorship or provide source/licence/assignment evidence. |
| Game prompts and copy | Prompt banks and interface text are embedded in app and Edge Function source. | Owner must confirm original authorship or document source/licence. |
| Fonts | No font files or remote font stylesheet found in reviewed tree. | Confirm no runtime-injected paid/external font. |
| Images, audio, video | No tracked media files identified. | Confirm no separately hosted, dynamically loaded or externally sourced media. |
| Dependencies | Supabase JS pinned to 2.118.0; no npm runtime dependencies declared in the small Node test manifest. | Produce a resolved dependency inventory/SBOM and retain licence notices for transitive dependencies. |
| Hosting/backend | Vercel and Supabase are provider services, not automatically transferred by repository sale. | Confirm account ownership, plan/terms, domain control and buyer migration/transfer route. |

## 3. XSS and unsafe-rendering source review

- The production `index.html` contains HTML-string rendering sinks using `innerHTML`. API-controlled values used in those templates are passed through the shared `esc()` helper before insertion, including game mode/question/answer, player display name, chooser name, reaction emoji, prompt text and mini-game text.
- The helper encodes ampersand, angle brackets, double quotes and apostrophes.
- The level-up confetti and badge templates use locally defined static values.
- `concept/index.html` and `studio/index.html` contain no `innerHTML` sink in the reviewed source.
- No `eval()`, `new Function()`, `document.write()`, `insertAdjacentHTML()` or `srcdoc` use was found in the three reviewed HTML files.
- A new Node regression test evaluates the actual production escaping helper against representative script, image-event, SVG-event, attribute-breakout, textarea-breakout and JavaScript-scheme strings. It also checks that known API-controlled fields remain escaped at the HTML-string sinks.

### Important browser-context caveat

Escaping is appropriate for the current HTML-text/template contexts inspected, but it is not a universal sanitizer for JavaScript, CSS, URL or arbitrary attribute contexts. The new checks are source-level regression tests running in Node; they do not create a browser DOM, execute payloads in Chrome/Safari, inspect the deployed bundle, test CSP enforcement, or simulate a malicious browser extension. No claim of a completed browser-based XSS test or penetration test is made.

## 4. Required actions before sale

- [ ] Owner confirms legal identity and authority to sell.
- [ ] Owner verifies all 133 commit records and confirms no unrecorded collaborators, contractors or external code sources.
- [ ] Owner supplies authorship/source evidence for `icon.svg` and game prompt/copy content.
- [ ] Owner confirms no external or separately stored media/fonts are used.
- [ ] Generate a resolved dependency SBOM and licence report.
- [ ] Run browser-based XSS tests on a controlled staging environment in current Safari and Chromium, including display names, prompts, answers, reactions and mini-game text.
- [ ] Test cross-room authorization, token replay, invite-code guessing and the latest recovery flow using isolated test rooms and two devices.
- [ ] Commission an independent penetration test before marketing Yarper as independently security-tested.

**Conclusion:** The repository history and tracked-file inventory are more thoroughly documented, and source-level XSS regression checks are now added. Ownership is still not proven and browser-level testing remains open.


## 5. Cross-room isolation verification (4 November 2026)

A production-database smoke test was run using two temporary synthetic rooms and a game session in the second room. The test attempted to submit that second room's game ID while supplying the first room's ID to `yarper_answer_game`.

Observed result:
- The cross-room attempt was rejected with `ROUND_NOT_WAITING`.
- The foreign game remained in `waiting` state.
- The first room's XP remained unchanged.
- A valid answer submitted against the correct room succeeded and awarded the expected 10 XP exactly once.
- Temporary test rooms, members, states and game data were deleted; a follow-up query found no leftover test game.

The deployed Edge Function source was also reviewed for room scoping:
- Snapshot member, game, history and reaction queries filter on the authenticated member's `couple_id`.
- Answer RPC receives `member.couple_id` from the validated device-token session, not from the request body.
- Reaction lookup requires both game ID and authenticated room ID.
- Whole-room deletion is scoped to the authenticated member's room ID.

Five Node regression tests now guard these source-level authorization invariants. They supplement, but do not replace, browser/device testing or an independent penetration test.

**Verification boundary:** This is a targeted database isolation smoke test and static source regression coverage. It is not a full cross-room penetration test of every API action or a browser-level test.


## 6. Recovery-token database verification (4 November 2026)

A second production-database smoke test used a temporary expired/revoked member slot:
- A recovery attempt with an unrelated token hash was rejected as a full couple; no slot takeover occurred.
- A recovery attempt with the exact prior device-token hash succeeded.
- The recovered record retained the original member ID.
- The stored token hash rotated to the new token hash.
- The recovered session became active again with revocation cleared and a future expiry.
- The synthetic couple and member were deleted after the test.

This verifies the database recovery gate and token rotation. It does not prove the frontend on two physical devices preserves and submits the old recovery token correctly. That end-to-end two-device check remains open.
