# Yarper — Privacy, Terms and User-Data Audit

**Audit date:** 4 November 2026  
**Status:** Technical data-flow audit completed; user deletion and rate-limit retention are implemented in production. Public legal documents and provider/legal review remain open.  
**Scope:** Repository source, deployed Edge Function, live Supabase schema metadata, migration history, function ACLs and security advisors. No production answer text or other user-record contents were inspected.

This is a technical data-mapping exercise, not legal advice or a certification of compliance with any country's privacy laws.

## 1. Data inventory

| Data category | Fields / source | Purpose | Notes |
|---|---|---|---|
| Display identity | yarper_members.display_name | Show each participant in the private room | User-supplied name, up to 40 characters. No email, phone or legal name field identified. |
| Room identifier | yarper_couples.code | Let a second participant join | Six-character code; treat as a secret access credential. |
| Device/session credential | Browser localStorage yarperToken / yarperRecoveryToken; database device_token_hash | Authenticate device requests and prove recovery | Raw bearer secret is held in browser storage; database stores SHA-256 hash. Sessions expire after 30 days of inactivity and can be revoked. |
| Presence / device activity | online, last_seen, created_at, token_expires_at, token_revoked_at | Show online/offline and manage sessions | Timestamps can reveal usage patterns. |
| User-generated content | yarper_game_sessions.question, answer | Store selected prompt and free-text response | Answers may contain intimate relationship information. Whole-room deletion is available. |
| Reactions | yarper_reactions.emoji, by_role, timestamps | Synchronize reactions | Linked to a room and game session. |
| Gameplay / reward state | XP, rounds, streaks, daily task state, turn state | Operate shared progress | Behavioral/gameplay data. |
| Abuse-prevention signal | SHA-256 of proxy IP header + action | Rate-limit create/join/game actions | Raw IP is not intentionally stored in the rate-limit table. The hash is still pseudonymous; hosting providers may separately process IP/request metadata. |
| Service / infrastructure metadata | Supabase and Vercel telemetry | Hosting, delivery, security and operation | Provider-side logs and retention were not audited. |

No email address, phone number, precise GPS/location, date of birth, payment details, advertising ID or third-party analytics SDK was identified in the inspected application schema/source. This is not proof that hosting providers or browser/device services never process such information.

## 2. Data flow

1. A user creates a room and enters a display name.
2. The API creates a six-character room code and random device token. The browser saves the token; the database stores a hash.
3. A second user joins with the room code and a display name.
4. Authenticated requests send the device token in x-yarper-token.
5. The API reads/writes member, state, game-session and reaction records in Supabase.
6. me / heartbeat requests refresh presence and session expiry.
7. Reset revokes the server-side token and preserves the old token as a recovery credential in that browser.
8. Abuse-prevention code hashes an IP-derived signal into a private rate-limit bucket.
9. Authenticated players can delete the entire room after entering its six-character code.

The public application tables have RLS enabled and no client policies; the server-side Edge Function and service-role database access are the intended data path. The private rate-limit table has a service-role-only policy. These controls do not replace a privacy notice, lawful basis, retention schedule or user-rights process.

## 3. Retention and deletion

| Data | Current behavior | Remaining gap |
|---|---|---|
| Device sessions | Expire after 30 days of inactivity; reset revokes token | Expiry/revocation alone does not delete room data. |
| Display names and membership | Deleted when the whole room is deleted | No separate one-member deletion. |
| Questions and answers | Deleted when the whole room is deleted | No separate answer-level delete/export. |
| Reactions | Deleted with the room/game session by cascade | Provider backups/logs may persist under provider policies. |
| Gameplay state | Deleted with the room by cascade | No separate progress export. |
| Rate-limit buckets | Active daily pg_cron job deletes records older than 7 days | Job verified active; monitor its execution history. |
| Abandoned room content | Remains until a player deletes the room | No automatic inactive-room retention period is implemented. |
| Provider logs/backups | Not inspected | Confirm provider-specific retention and deletion limits. |

**Whole-room deletion is now available:** An authenticated player can open Settings, select “Delete our couple space and all shared data,” and enter the six-character room code. The API checks the authenticated member and matching room code, then deletes the couple row. Foreign-key cascades remove both member records, state, game sessions, answers and reactions. The UI warns that this also removes the partner's access and shared history. Disposable-data SQL smoke tests verified the cascade behavior.

This is not an export tool or per-user deletion workflow. Provider backups and security logs may persist for a limited period under provider retention policies.

## 4. Privacy and legal-document status

The repository now contains:
- docs/PRIVACY_POLICY_DRAFT.md
- docs/TERMS_OF_SERVICE_DRAFT.md

Both are explicitly marked DRAFT — DO NOT PUBLISH. They are not linked in the live app. They contain placeholders that must be completed by the actual operator and reviewed for the intended jurisdictions.

Known infrastructure facts:
- Supabase database region: eu-west-1.
- Vercel production deployment region reported for the deployment: iad1.
- These facts do not establish the location of every provider log, backup, support system or subprocessor.

Before publication, the owner/operator must verify:
- Legal operator / seller identity and a working privacy/support contact.
- Countries where Yarper will be offered and applicable privacy/consumer laws.
- Minimum user age.
- Purposes and lawful basis for each data category.
- Supabase and Vercel agreements, data-processing terms, subprocessors, data regions, backups and provider log retention.
- Whether any analytics, crash reporting, advertising, email or other integrations exist outside the inspected source.
- Final retention period for abandoned room content.
- Request verification, response timelines, breach response and regulator contact process.
- Applicable international-transfer safeguards.

Do not publish placeholders, invented contact details or unsupported compliance claims. Have final documents reviewed for actual operating jurisdictions.

## 5. Current status

- [x] Technical data inventory and flow review.
- [x] Session expiry/revocation review.
- [x] Secure recovery proof-of-possession fix deployed.
- [x] Authenticated whole-room deletion endpoint and Settings control deployed.
- [x] Deletion cascade verified with disposable records.
- [x] Rate-limit cleanup function and daily scheduled job deployed; old bucket cleanup smoke test passed.
- [x] Sensitive-information warning added beside free-text answer input.
- [ ] Publish reviewed privacy notice and terms with accurate operator/contact details.
- [ ] Confirm provider processing, data regions, subprocessors, logs and backup retention.
- [ ] Set and publish an inactivity-retention period for abandoned room content.
- [ ] Add privacy/support contact and verified request-handling process.
- [ ] Review localStorage bearer-token exposure and browser XSS risk.
- [ ] Obtain jurisdiction-specific legal review before claiming privacy-law compliance.

## 6. Owner decisions / external facts still required

These cannot be safely inferred from code or account metadata:
1. Which countries will Yarper actively serve?
2. What minimum age will apply?
3. What legal name or business entity operates Yarper, and what working privacy contact email should be published?
4. What final retention period should apply to abandoned rooms and game answers?
5. Which governing law and dispute forum should the Terms use?

**Audit conclusion:** Yarper stores display names, room identifiers, device/session metadata, presence timestamps, prompts/answers, reactions, gameplay state and hashed IP-derived rate-limit identifiers. Secure session recovery, whole-room deletion and rate-limit metadata cleanup are deployed. Public privacy/terms documents, abandoned-room retention, provider-log/backup review and jurisdictional legal review remain open.
