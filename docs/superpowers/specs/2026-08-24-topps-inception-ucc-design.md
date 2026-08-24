# Topps Inception UCC Catalogue Design

Date: 2026-08-24

## Goal

Add 2025/26 Topps Inception UEFA Club Competitions to the existing Card Aesthetics desktop catalogue using one representative for every main card type, with Club Crest Autograph Patch versions 1 and 2 shown separately.

## Catalogue scope

- Publish 33 independently rateable display objects: 32 main card types plus the second Club Crest version.
- Use the lowest-numbered trustworthy public example found for each type where practical.
- Dark Flow is displayed as Gold Foil `1/1`.
- Display Club Crest Autograph Patch version 1 and version 2 separately.
- Publish the 25 verified real-card images already collected.
- Keep the eight card types without trustworthy public images in the catalogue as `unverified` placeholders; never substitute a similar card.

## Image treatment

- Preserve every original card pixel that contains artwork, printed text, serial numbering, autograph, patch, or memorabilia.
- Apply only deterministic, non-generative edits: crop seller-page margins, normalize orientation, and place the result on a consistent portrait or landscape canvas.
- Portrait assets use 750 x 1050 pixels. Book cards and other horizontal designs use 1050 x 750 pixels.
- Do not use generative fill or reconstruction because it could falsify card details.
- Use an official product image for packaging when available.

## Application integration

- Add the series through the typed catalogue data layer; generic routes and existing rating components remain unchanged.
- Provide Simplified Chinese, English, and Spanish names and alt text.
- Use `base` for the seven base families and `insert` for Dark Flow, autograph, relic, and autograph-relic types.
- Add validation tests for count, slugs, Dark Flow numbering, the two Club Crest versions, verified/unverified image status, file presence, and all landscape layouts.
- Rebuild the offline Electron export and Windows installer after all tests pass.
