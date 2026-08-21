import { expect, it } from "vitest";
import { getOrCreateDeviceId } from "@/lib/deviceIdentity";

it("keeps one anonymous identity for the same browser storage", () => {
  const storage = window.localStorage;
  storage.clear();
  const first = getOrCreateDeviceId(storage);
  const second = getOrCreateDeviceId(storage);

  expect(second).toBe(first);
  expect(first).toMatch(/^[0-9a-f-]{36}$/);
});
