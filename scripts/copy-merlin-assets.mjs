import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const research = path.join(root, "research", "topps-merlin-premier-league-2026");
const destination = path.join(root, "public", "images", "merlin-2026");
const cardDestination = path.join(destination, "cards");

await mkdir(cardDestination, { recursive: true });
await copyFile(
  path.join(research, "official-gallery", "atlantic-01.webp"),
  path.join(destination, "packaging.webp"),
);

const cardHobbyFiles = [
  "base", "refractor", "raywave", "mojo", "vintage-merlin", "vhs-refractor",
  "pink-refractor", "aqua-refractor", "aqua-mojo", "blue-refractor", "blue-mojo",
  "green-refractor", "green-mojo", "purple-refractor", "purple-mojo", "gold-refractor",
  "gold-mojo", "orange-refractor", "orange-mojo", "black-refractor", "red-refractor",
  "fantasy-football", "mystic-afternoons", "merlin-speaks", "ta-da", "the-shiny",
  "rainbow-flick",
];

for (const slug of cardHobbyFiles) {
  await copyFile(
    path.join(research, "cardhobby-images", `${slug}.jpg`),
    path.join(cardDestination, `${slug}.jpg`),
  );
}

const renamedCardHobbyFiles = {
  "merlins-young-magicians": "merlin-s-young-magicians.jpg",
  "merlins-mythical-art": "merlin-s-mythical-art.jpg",
};

for (const [slug, filename] of Object.entries(renamedCardHobbyFiles)) {
  await copyFile(
    path.join(research, "cardhobby-images", filename),
    path.join(cardDestination, `${slug}.jpg`),
  );
}

const secondaryFiles = {
  "battle-of-britpop": "battle-of-britpop-95.webp",
  "black-mojo": "black-mojo-10.webp",
  "red-mojo": "red-mojo-5.webp",
  superfractor: "superfractor-1of1.webp",
  "merlin-premier-league-1996-edition": "1996-edition.webp",
  renaissance: "renaissance.webp",
  "magic-in-his-boots": "magic-in-his-boots.webp",
  "merlins-magnum-opus": "magnum-opus.webp",
  "mask-off": "mask-off.webp",
};

for (const [slug, filename] of Object.entries(secondaryFiles)) {
  await copyFile(
    path.join(research, "secondary-market-images", filename),
    path.join(cardDestination, `${slug}.webp`),
  );
}

console.log("Copied Merlin packaging and 38 card-design images.");
