import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  getCardDesign,
  getSeries,
  merlinPremierLeague2026,
} from "@/data/catalogue";
import { validateSeries } from "@/domain/catalogue";

describe("Merlin Premier League 2026 catalogue", () => {
  it("contains all independent rating designs", () => {
    expect(merlinPremierLeague2026.cardDesigns).toHaveLength(38);
    expect(
      merlinPremierLeague2026.cardDesigns.filter((card) => card.group === "base"),
    ).toHaveLength(25);
    expect(
      merlinPremierLeague2026.cardDesigns.filter((card) => card.group === "insert"),
    ).toHaveLength(13);
  });

  it("uses the verified low-numbered print runs", () => {
    expect(getCardDesign("red-mojo")?.serial).toBe("/5");
    expect(getCardDesign("superfractor")?.serial).toBe("1/1");
  });

  it("passes source, translation, and uniqueness validation", () => {
    expect(validateSeries(merlinPremierLeague2026)).toEqual([]);
    expect(getSeries("topps-merlin-premier-league-2026")).toBe(
      merlinPremierLeague2026,
    );
  });

  it("has one packaging image and one local image per card", () => {
    const images = [
      merlinPremierLeague2026.packaging.path,
      ...merlinPremierLeague2026.cardDesigns.map((card) => card.image.path),
    ];

    expect(new Set(images)).toHaveLength(39);
    for (const image of images) {
      expect(fs.existsSync(path.join(process.cwd(), "public", image))).toBe(true);
    }
  });
});
