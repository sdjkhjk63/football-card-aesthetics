const DEVICE_ID_KEY = "card-aesthetics-device-id-v1";

export function getOrCreateDeviceId(providedStorage?: Storage): string {
  let storage = providedStorage;
  if (!storage && typeof window !== "undefined") {
    try { storage = window.localStorage; } catch { storage = undefined; }
  }
  if (storage) {
    const existing = storage.getItem(DEVICE_ID_KEY);
    if (existing) return existing;
  }
  const id = crypto.randomUUID();
  try { storage?.setItem(DEVICE_ID_KEY, id); } catch { /* session identity still works */ }
  return id;
}
