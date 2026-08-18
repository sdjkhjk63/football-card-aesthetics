import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { RatingForm } from "@/components/RatingForm";
import { createLocalRatingRepository } from "@/lib/localRatingRepository";

const perfect = { composition: 8, colorFinish: 8, themeIdentity: 8, typographyDetails: 8 };

function emptyStorage(): Storage {
  const data = new Map<string, string>();
  return { get length() { return data.size; }, clear: () => data.clear(), getItem: (key) => data.get(key) ?? null, key: (index) => [...data.keys()][index] ?? null, removeItem: (key) => { data.delete(key); }, setItem: (key, value) => { data.set(key, value); } };
}

afterEach(() => { document.body.innerHTML = ""; });

it("hydrates with saved browser ratings without a markup mismatch", async () => {
  const serverRepository = createLocalRatingRepository(emptyStorage());
  Object.defineProperty(serverRepository, "persistence", { value: "session" });
  const clientRepository = createLocalRatingRepository(window.localStorage);
  clientRepository.save("hydration-card", perfect);
  const container = document.createElement("div");
  container.innerHTML = renderToString(<RatingForm cardSlug="hydration-card" repository={serverRepository} locale="en" />);
  document.body.append(container);
  const errors = vi.spyOn(console, "error").mockImplementation(() => undefined);

  await act(async () => {
    hydrateRoot(container, <RatingForm cardSlug="hydration-card" repository={clientRepository} locale="en" />);
  });

  expect(errors.mock.calls.flat().join(" ")).not.toMatch(/hydration failed|didn't match/i);
  errors.mockRestore();
});
