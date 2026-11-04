# Yarper — Privacy, Terms and User-Data Audit

**Audit date:** 4 November 2026  
**Status: AUDIT COMPLETE — PRODUCT DOCUMENTATION AND DATA-LIFECYCLE GAPS REMAIN OPEN.**  
**Scope:** Repository source, deployed `yarper-api` source, live Supabase schema metadata, migration history and database security advisor findings. No production answer text or other user-record contents were inspected.

This is a technical data-mapping exercise, not legal advice or a certification of compliance with any country's privacy laws.

## 1. Data inventory

| Data category | Fields / source | Purpose inferred from implementation | Notes |
|---|---|---|---|
| Display identity | `yarper_members.display_name` | Show each participant in the private two-person room | User-supplied name, up to 40 characters. No email, phone number or legal name field was identified. |
| Room identifier | `yarper_couples.code` | Let a second participant join the shared room | Six-character code; should be treated as a secret access credential and not shared publicly. |
| Device/session credential | Browser `localStorage` key `yarperToken`; database `device_token_hash` | Authenticate device requests | Raw token is held in the browser; database stores its SHA-256 hash. Tokens expire after 30 days of inactivity and can be revoked. |
| Presence / device activity | `online`, `last_seen`, `created_at`, `token_expires_at`, `token_revoked_at` | Show partner online/offline and manage sessions | Timestamps can reveal usage patterns. |
| User-generated content | `yarper_game_sessions.question`, `answer` | Store selected prompt and the partner's free-text response | Answers can contain intimate or otherwise sensitive relationship information. No content moderation or user-facing delete control was identified in the inspected UI/API. |
| Reactions | `yarper_reactions.emoji`, `by_role`, timestamps | Synchronize reactions in a round | Linked to a room and game session. |
| Gameplay / reward state | XP, rounds, streaks, daily task state, turn state | Operate shared progress and rewards | Behavioral/gameplay data. |
| Abuse-prevention signal | Edge Function reads proxy IP headers, computes SHA-256 of `ip + "|yarper|" + action`, and stores a bucket key in `private.yarper_rate_limits` | Rate-limit create/join/game actions | Raw IP is not intentionally stored in this table by the inspected code. The hash is still a pseudonymous identifier; proxy headers and provider infrastructure may independently process IP addresses. |
| Service / infrastructure metadata | Supabase and Vercel service telemetry | Hosting, delivery, security and operation | Provider-side logs and retention were not audited. |

No email address, phone number, precise GPS/location, date of birth, payment details, advertising ID, or third-party analytics SDK was identified in the inspected application schema and source. This is a source/schema observation, not proof that hosting providers or browser/device services never process such information.

## 2. Data flow

1. A user creates a room and enters a display name.
2. The API creates a six-character room code and a random device token. The browser saves the token in localStorage; the database stores a hash.
3. A second user joins with the room code and a display name.
4. Authenticated device requests send the token in the `x-yarper-token` header.
5. The API reads/writes the room's member, state, game-session and reaction records in Supabase.
6. The app refreshes presence and session expiry through `me` / heartbeat requests.
7. Reset attempts server-side token revocation before clearing local browser storage.
8. Abuse-prevention code reads a client IP from proxy headers and stores a hash-based rate-limit bucket in a private schema.

The public application tables have RLS enabled and currently have no client policies; the inspected architecture relies on the server-side Edge Function and service-role database access. The private rate-limit table has a service-role-only policy. These are technical access controls, not a substitute for a privacy notice, lawful basis, retention schedule or user rights process.

## 3. Retention and deletion findings

| Data | Current behavior evidenced | Gap / recommended policy decision |
|---|---|---|
| Device sessions | Expire after 30 days of inactivity; reset revokes token | Expiry/revocation does not delete the member or linked room data. |
| Display name and room membership | Remain in database until separately deleted | Define when inactive rooms and their member records are deleted or anonymized. |
| Questions and answers | Stored in game-session rows; no delete action identified | Define user deletion request handling and a retention period for free-text content. |
| Reactions | Stored in reaction rows; no delete action identified | Delete with associated room/game data. |
| Gameplay state | Stored in shared state row; no delete action identified | Delete or anonymize with the room. |
| Rate-limit buckets | Upserted by hashed IP/action/window; no cleanup job/function identified | Add a scheduled expiry/cleanup policy for old buckets and document its period. |
| Provider logs/backups | Not inspected | Review Supabase/Vercel log, backup and deletion retention settings and describe limits accurately. |

**Important:** The current API does not expose a user-facing account/room deletion or data-export action. Do not promise immediate or complete deletion until database cascades, backups, provider logs and an operational request process are verified.

## 4. Privacy and legal-document status

The inspected repository tree does not contain a completed privacy policy, terms of service, cookie notice, data deletion procedure, or support/contact page. No user-facing links to these documents were identified in the main app screen/settings source.

Before publishing legal documents, the owner must decide and verify:

- Legal operator / seller identity and a working privacy contact address.
- Countries where the app will be offered and which privacy laws apply.
- Minimum user age and whether underage users are allowed.
- Whether relationship answers may include sensitive personal information and whether the app should warn users not to enter highly sensitive details.
- Purposes and lawful basis for each data category.
- Supabase and Vercel as service providers, their current terms, data-processing terms, hosting regions and subprocessors.
- Any analytics, crash reporting, advertising, email or other integrations added outside the inspected repository.
- Retention periods, deletion request workflow, backup/log exceptions and breach response contact.
- Whether users can request access, correction, export, deletion, or close a room, and how requests are authenticated.
- Whether the service is intended for consumers in Ghana, the EEA/UK, the US or other regions, which affects the appropriate legal review.

Do not publish placeholder names, made-up contact details, or unsupported compliance claims. Have the final policy and terms reviewed for the actual operating jurisdictions.

## 5. Required product changes before a sale listing

- [ ] Add an accessible privacy notice link on the join/create screen and in Settings.
- [ ] Add terms of service link and record acceptance in an appropriate, minimal way if required.
- [ ] Decide and implement room/member deletion and user-data request workflow.
- [ ] Implement a documented retention and cleanup policy for abandoned room data and rate-limit buckets.
- [ ] Confirm foreign-provider processing, regions, subprocessors, logs and backup retention.
- [ ] Add a short warning not to enter highly sensitive personal information into free-text answers.
- [ ] Add an operational privacy contact and a process for verified requests.
- [ ] Review localStorage token exposure and client-side script/XSS risks before broad commercial operation.
- [ ] Test deletion across all linked tables and confirm what remains in backups/provider logs.
- [ ] Obtain jurisdiction-specific legal review before claiming privacy-law compliance.

## 6. Owner decisions still required

The following are not safely inferable from source code and need the owner's confirmation:

1. Which countries will Yarper actively serve at launch?
2. What minimum age should apply? The product should not silently assume that children are permitted.
3. What legal name or business entity will operate Yarper, and what privacy contact email should users use?
4. Should a user be able to delete the whole couple room and both members' linked content, subject to a verified ownership process?
5. What retention period should apply to inactive rooms and game answers?

**Audit conclusion:** Yarper currently stores display names, room identifiers, device-session metadata, presence timestamps, game prompts/answers, reactions, gameplay state and hashed rate-limit identifiers. Session expiry/revocation is implemented, but data deletion, retention schedules, public privacy/terms documents and provider-log review are not evidenced. Keep privacy/legal readiness marked pending until product decisions, implementation and jurisdictional review are complete.
