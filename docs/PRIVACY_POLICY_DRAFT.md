# Yarper Privacy Notice — Draft for Legal Review

**Publication status: DRAFT — DO NOT PUBLISH UNTIL THE BRACKETED OPERATOR AND JURISDICTION DETAILS ARE COMPLETED AND LEGAL REVIEW IS DONE.**

- Effective date: [EFFECTIVE DATE]
- Service operator: [FULL LEGAL NAME / REGISTERED BUSINESS NAME]
- Privacy contact: [WORKING PRIVACY CONTACT EMAIL]
- Applicable operating jurisdictions: [COUNTRIES / JURISDICTIONS]

## 1. Who operates Yarper

Yarper is operated by **[FULL LEGAL NAME / BUSINESS NAME]** ("Yarper", "we", "us"). The operator is responsible for deciding how personal information is processed. Contact us at [WORKING PRIVACY CONTACT EMAIL] for privacy requests.

## 2. Information we process

When you use Yarper, we process:

- **Display names** you enter for each player.
- **Couple room code** used to invite the second player.
- **Device session credentials:** a random device token is stored in your browser and a SHA-256 hash is stored by our backend. Sessions expire after 30 days of inactivity and can be revoked.
- **Presence and session timestamps:** online status, last-seen time, creation time, expiry and revocation time.
- **Game content:** selected prompts and free-text answers you submit. Your answers may reveal private relationship information. Do not submit highly sensitive personal information.
- **Reactions and gameplay state:** reactions, XP, rounds, streaks, turn state and daily quest progress.
- **Abuse-prevention identifiers:** the backend derives a SHA-256 bucket key from a client IP address and request type for rate limiting. The application rate-limit table stores this derived key rather than the raw IP address. Hosting providers may process IP addresses and request metadata in their own infrastructure logs.

The application schema and source inspected for this draft did not identify account email, phone number, precise GPS location, date of birth, payment card or advertising identifier fields. This statement does not cover data independently processed by your device, browser, network provider or infrastructure providers.

## 3. Why we use information

We use the information above to:

- Create and secure private two-player rooms.
- Authenticate devices and recover a room only when the previous device credential is presented.
- Synchronize gameplay, answers, reactions, presence and progress.
- Prevent abuse and enforce request limits.
- Maintain, troubleshoot and protect the service.
- Respond to verified privacy or support requests.

We do not currently identify an advertising or analytics SDK in the inspected application source.

## 4. Sharing and service providers

Yarper uses Supabase for database and backend hosting and Vercel for application hosting and delivery. The Supabase database's primary region is eu-west-1. Supabase's published data-residency information says core database data and backups are hosted in the selected project region, while account/billing data, support access, telemetry/logs and subprocessors may involve other regions. The current Vercel production deployment reports iad1, but Vercel's published DPA describes primary processing facilities in the United States and processing by global subprocessors. The exact account plan and contractual terms must be confirmed by the operator. These provider arrangements may involve international processing; the operator must verify current agreements, subprocessors, data regions, backup retention and transfer safeguards before publication.

We do not sell personal information as part of the current product design. This draft does not make a claim about independent provider processing; see each provider's applicable privacy terms.

## 5. Retention

- Device sessions expire after 30 days of inactivity. Expiry or revocation alone does not erase room data.
- Rate-limit bucket records are scheduled for deletion after they are more than 7 days old, once the cleanup migration and scheduled job are deployed and verified.
- Room names, answers, reactions and progress remain until a player deletes the whole room or a future published inactivity-retention schedule applies.
- Provider logs and backups may have separate retention periods set by the providers.

The operator must set and publish a final inactivity-retention period for abandoned rooms before this notice is published. Rate-limit bucket metadata older than seven days is removed by an active daily cleanup job.

## 6. Deleting a room

An authenticated player can request permanent deletion from Settings by entering the room's six-character code. Deleting a room removes the shared room, both player records, game answers, reactions and progress through database cascade deletion. It also removes the other player's access. The action is irreversible in the live application.

Provider backups and security logs may persist for a limited period under provider retention policies. Those limits must be confirmed and described before publication.

## 7. Security

We use server-side device-token validation, hashed device credentials in the database, session expiry and revocation, restricted database grants, row-level security, request rate limits and browser security headers. No online service can guarantee absolute security. Do not share your room code or device access with people you do not trust.

## 8. Children and minimum age

[OPERATOR MUST CHOOSE A MINIMUM AGE AND VERIFY THE RULES FOR EACH LAUNCH JURISDICTION. RECOMMENDED DEFAULT FOR THIS RELATIONSHIP-ORIENTED SERVICE: 18+. DO NOT PUBLISH UNTIL CONFIRMED.]

## 9. Your privacy rights

Depending on the laws that apply to you, you may have rights to request access, correction, deletion, restriction, objection, portability or to complain to a regulator. Contact [WORKING PRIVACY CONTACT EMAIL]. We may need to verify that you control the relevant device or room before acting. The operator must define an identity-verification and response-time procedure before publication.

## 10. International processing

Supabase and Vercel may process data in regions outside your country. The operator must confirm actual project regions and provider transfer terms, then complete this section with accurate information and any safeguards required by applicable law.

## 11. Ghana-specific review\n\nIf Yarper is operated from Ghana or offered to people in Ghana, the operator must obtain Ghana-specific legal advice on the Data Protection Act, 2012 (Act 843), including whether registration with the Data Protection Commission is required and what notices, safeguards and cross-border transfer measures apply. This draft does not determine the operator's legal obligations.\n\n## 12. Changes

We may update this notice as the service changes. We will update the effective date and provide notice of material changes as required by applicable law.

## 13. Contact

Privacy requests: [WORKING PRIVACY CONTACT EMAIL]  
Operator: [FULL LEGAL NAME / BUSINESS NAME]  
Business address, if legally required: [BUSINESS ADDRESS]
