# Third-Party Asset and Licence Register

**Audit date:** 4 November 2026  
**Status: PARTIALLY REVIEWED — rights-holder confirmation and supporting evidence are still required before sale.**

This register records a repository-level inspection of the private `chloestyles70-afk/yarper` repository on its `main` branch. It is not a legal opinion, a complete historical-source audit, or proof that all intellectual-property rights belong to the seller.

## Repository inventory reviewed

The recursive repository tree was inspected. It contains the main static app (`index.html`), two additional HTML pages (`concept/index.html` and `studio/index.html`), `icon.svg`, a web-app manifest, a small Node test setup, Supabase Edge Function source, two SQL migrations, and project documentation.

No raster image, audio, video, font, or vendored third-party asset files appeared in the inspected repository tree. This does not rule out assets loaded dynamically from services or assets stored outside Git.

## Code, libraries and hosted services

| Item | Evidence found | Rights / transfer position | Required action |
|---|---|---|---|
| Yarper frontend and app logic | Static HTML, CSS and browser JavaScript in `index.html`; prototypes also exist under `concept/` and `studio/`. | Repository contains a proprietary notice, but that notice alone does not prove authorship or assignment. | Rights holder must confirm original authorship and identify any copied/adapted code. Review historical commits and all contributors. |
| Node test setup | `package.json` uses Node's built-in test runner; no third-party Node package dependency is declared. | No third-party Node package identified in the manifest. | Keep this assessment current if dependencies are added. |
| Supabase Edge Runtime | Edge Function imports `jsr:@supabase/functions-js/edge-runtime.d.ts`. | Supabase-hosted runtime/service; subject to provider terms. | Review current plan, service terms, account ownership, data processing terms and buyer migration/transfer steps. |
| Supabase JavaScript client | Edge Function imports `https://esm.sh/@supabase/supabase-js@2.118.0`. | Third-party open-source library delivered through esm.sh; pinned to exact version 2.118.0. The package is MIT-licensed. | Pinning completed at 2.118.0; preserve the deployed source and verify the transitive dependency graph / SBOM before sale. |
| Vercel | Production app is hosted at `yarper.vercel.app`. | Hosting and domain configuration are provider/account assets, not transferred by copying the repository. | Review current plan, account ownership, domain registrar, project transfer and billing handover. |
| Supabase project | Frontend calls the project's Supabase Edge Function endpoint. | Backend project, database, storage/configuration and billing are separate provider assets. | Prepare a buyer-controlled transfer or migration plan; never include secrets in the sale package. |
| External frontend resources | URL scan of the main app found the Supabase function endpoint; no remote font stylesheet or remote image URL was identified in the main frontend source. | No externally hosted visual resource was identified in this source scan. | Confirm deployed runtime/network requests and any dynamic content before sale. |

## Visual and content assets

| Asset | Evidence found | Rights position | Required action |
|---|---|---|---|
| App icon | `icon.svg` is committed and referenced by the app and manifest. | Creator/source and assignment are not established by the file's presence. | Owner to confirm original creation or provide source and commercial-use/transfer licence. |
| Fonts | Main CSS names Inter, followed by system font fallbacks; no font file or remote font stylesheet was found in the repository scan. | No separately hosted font asset identified in source. | Confirm no external font service or paid font asset is injected at runtime. |
| Images / illustrations | No raster image files or remote image URLs were found in the inspected app source. | No image licence identified from repository evidence. | Check live app network requests and any separately stored or dynamically supplied media. |
| Sound / music | No audio file was found in the repository tree or main app source scan. | No audio asset identified. | Confirm none is loaded from an external service or stored outside Git. |
| Game prompts and copy | Prompt banks and interface text are embedded in `index.html` and the Edge Function source. | Authorship and source history are not proven by the current inspection. | Owner to confirm the text is original or document any copied/adapted text and permissions. |
| Emoji | Standard Unicode emoji appear in the interface. | No separate emoji image pack was identified. | Recheck if a third-party emoji library is introduced later. |

## Proprietary notice

`LICENSE.md` states that Yarper is proprietary software, reserves rights to the copyright owner, and says third-party materials remain subject to their own terms. This is a useful notice, but it is not proof of the identity of the rights holder, original authorship, contributor assignments, or clearance of third-party material.

## Contributor statement and owner declaration — still required

The owner reports that no one else contributed code, design, the icon or game content. This is owner-confirmed, not independently verified: the connected GitHub inspection could not retrieve the full historical contributor list/commit history. Review local or exported Git history and retain the owner's signed declaration before sale.



The rights holder must confirm in writing and retain supporting evidence for each applicable item:

- [ ] Identify the legal/person name that owns the Yarper intellectual property and confirm authority to sell it.
- [ ] Confirm all original code was written by the owner or validly assigned to the owner.
- [ ] Review Git history and identify every contributor, contractor or collaborator; obtain signed IP assignments or licences where required.
- [ ] Identify any code copied or adapted from external examples, repositories, templates or AI-generated sources, and record the applicable rights/terms.
- [ ] Confirm the icon was created by the owner or provide its source and assignment/licence.
- [ ] Confirm all fonts, images, illustrations, sounds and other media have documented commercial-use and transfer rights, or confirm none are used.
- [ ] Confirm prompt text and other content is original or appropriately licensed.
- [ ] Confirm no purchased template, marketplace script or prohibited reskin forms the basis of the product.
- [ ] Confirm third-party trademarks are not represented as Yarper-owned assets.
- [ ] Confirm which Vercel, Supabase, domain, analytics, email and other service accounts can be transferred, and which require buyer-owned replacement accounts.

## Sale handover requirements

- [ ] Prepare a signed asset schedule listing each owned asset and each excluded/non-transferable third-party service.
- [ ] Provide copies of third-party licences and contributor IP assignments to the buyer where permitted.
- [ ] Prepare a clean deployment guide and buyer-controlled staging deployment.
- [ ] Transfer or rotate all credentials securely at closing; do not put secrets in the repository or listing.
- [ ] Document provider account transfer restrictions, recurring fees, renewals and required buyer subscriptions.

**Do not mark this register complete based only on the absence of dependency files or media files from the repository.** The live deployment, backend project, historical commits, contributor arrangements, and separately stored assets must also be checked. Repository inspection cannot independently establish ownership or legal transferability.
