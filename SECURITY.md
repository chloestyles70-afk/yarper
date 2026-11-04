# Security Policy

## Supported scope

The current supported product surface is the deployed Yarper web application, the checked-in Supabase Edge Function source and its database-backed API.

## Reporting a vulnerability

Please do not publish exploit details, access tokens, personal data, or database exports in a public issue. Contact the repository owner privately through the GitHub account that owns this repository and include:

- A concise description of the issue and affected component.
- Reproduction steps using test accounts and non-production data.
- The potential impact.
- Any suggested mitigation.

Do not access, modify, retain, or disclose another person's data while testing.

## Credential handling

- Never commit Supabase service-role keys, Vercel tokens, database passwords, private signing keys, or user session tokens.
- Keep server-side secrets in the hosting provider's secret manager.
- Rotate exposed credentials immediately.
- Do not include production secrets or real user data in buyer-facing materials.

## Current assurance

The deployed Edge Function source is checked into supabase/functions/yarper-api/index.ts, with its session policy module and function configuration in the repository. Device tokens expire after 30 days of inactivity and are refreshed by successful `me`/heartbeat requests. The Reset this device action revokes the server-side token hash before clearing local storage. Recovery requires the couple code and the same display name, which replaces the previous token hash. This policy is not a penetration-test report or a security certification. No independent penetration test has been completed.
