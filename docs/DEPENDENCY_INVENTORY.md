# Yarper — Dependency Inventory and SBOM Notes

**Audit date:** 4 November 2026  
**Status:** Direct-dependency inventory prepared; a complete resolved transitive SBOM is still outstanding.

## Application dependency inventory

| Component | Location / source | Version pin | License / notes |
| --- | --- | --- | --- |
| `@supabase/supabase-js` | Supabase Edge Function import from esm.sh | `2.118.0` | MIT; direct runtime SDK dependency. |
| `@supabase/functions-js/edge-runtime.d.ts` | JSR import in the Edge Function | No explicit version in source | Type/runtime declaration import used by the Deno Edge Function environment. Exact resolved package version and license should be confirmed from JSR metadata during buyer due diligence. |
| Local session policy module | `supabase/functions/yarper-api/session-policy.mjs` | Repository source | First-party local module; not an external package. |
| Browser client | `index.html`, `sync-scheduler.js` | Repository source | No separate frontend package dependency manifest was identified during this inventory. |

## Node tooling

`package.json` identifies the project as private, requires Node.js 20 or newer, and defines `npm test`. It declares no `dependencies` or `devDependencies`.

No `package-lock.json`, `npm-shrinkwrap.json`, `pnpm-lock.yaml`, `yarn.lock`, `deno.json` or `deno.lock` was found in the repository tree at the time of this review. Consequently, npm does not currently describe a resolved application dependency tree, and the Deno/JSR import is not captured in a lockfile.

## Operational tools (not shipped application libraries)

- Supabase CLI — database migration, export and deployment operations.
- Docker — required by Supabase CLI database dump workflow.
- `age` — encryption for offline database backups.
- `psql` — restore verification and data import.
- Vercel and Supabase managed services — hosting/backend platforms, not dependencies vendored in the application.

Record exact tool versions in the buyer's operating environment and review provider terms separately.

## Scope and limitations

This is a source-reviewed direct-dependency inventory, **not a complete CycloneDX or SPDX SBOM**. It does not establish the complete transitive dependency graph resolved by esm.sh or JSR, nor every platform-side dependency used by Supabase Edge Runtime or Vercel.

Before a final acquisition:
1. Resolve and record the full transitive dependency graph for the exact deployed Edge Function imports.
2. Verify the exact JSR package version and license.
3. Generate a machine-readable SPDX or CycloneDX SBOM from the resolved graph.
4. Review vulnerabilities and license obligations for every resolved package.
5. Keep dependency pins and lockfiles under version control where the runtime/toolchain supports them.

Do not represent this inventory as proof that every transitive dependency has been security-scanned or license-cleared.
