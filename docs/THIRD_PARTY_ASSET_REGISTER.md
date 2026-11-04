# Third-Party Asset and Licence Register

**Status: NOT YET COMPLETE — owner verification required before sale.**

This register is intentionally a checklist, not a claim that every asset has already been cleared.

## Code and runtime dependencies

| Item | Current evidence | Required action |
|---|---|---|
| Frontend framework | The checked-in application is a static HTML/CSS/JavaScript page; no framework package manifest or dependency lockfile was present at audit time. | Confirm whether any code was copied or adapted from external examples or repositories. Record sources and applicable licences. |
| Node.js test runner | Built-in Node.js test runner is used by the existing scheduler test. | No third-party runtime package identified in the checked-in test setup. |
| Supabase | External backend service and API endpoint. | Review current Supabase plan and terms, service ownership, data processing terms and transfer procedure. |
| Vercel | External hosting provider. | Review current plan, terms, project transfer and domain configuration. |

## Visual and content assets

| Asset category | Evidence | Required action |
|---|---|---|
| Application icon | icon.svg is checked into this repository. | Confirm it was created by the owner or obtain source/assignment evidence. |
| Fonts | CSS uses system font fallbacks and names Inter. No font file was found in the repository tree. | Confirm no externally hosted font file or paid font licence is used at runtime. |
| Images and illustrations | No raster image files were present in the inspected repository tree. | Check the live app and all remote content for externally sourced images. |
| Game prompts and copy | Prompt banks are embedded in index.html. | Confirm authorship or document any copied/adapted text. |
| Emoji | Standard Unicode emoji are used in the interface. | Check any platform-specific rendering or third-party emoji assets, if added later. |

## Owner declaration to complete

Before listing, the rights holder should confirm in writing:

- [ ] All original code was written by the owner or validly assigned to the owner.
- [ ] Every contributor, contractor or collaborator has signed an appropriate IP assignment.
- [ ] Every third-party code component has a recorded source, version and licence.
- [ ] Every image, icon, font, sound and other media asset has documented rights for commercial use and transfer where applicable.
- [ ] Prompt text and other content is original or appropriately licensed.
- [ ] No purchased template, marketplace script or prohibited reskin forms the basis of the product.
- [ ] No third-party trademarks are presented as Yarper-owned assets.

Do not mark this register complete based only on the absence of dependency files or image files from this repository. The live deployment, backend project, historical commits and any separately stored assets must also be checked.
