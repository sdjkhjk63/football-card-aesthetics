const STORAGE_KEY = "card-aesthetics-author-notes-v1";

export interface AuthorNoteRepository {
  get(cardSlug: string): string | null;
  save(cardSlug: string, note: string): string;
}

export function createLocalAuthorNoteRepository(providedStorage?: Storage): AuthorNoteRepository {
  let storage = providedStorage;
  if (!storage && typeof window !== "undefined") {
    try { storage = window.localStorage; } catch { storage = undefined; }
  }
  const memory: Record<string, string> = {};
  const read = () => {
    if (!storage) return memory;
    try { return JSON.parse(storage.getItem(STORAGE_KEY) ?? "{}") as Record<string, string>; }
    catch { return memory; }
  };
  return {
    get(cardSlug) { return read()[cardSlug] ?? null; },
    save(cardSlug, note) {
      const normalized = note.trim().slice(0, 1200);
      const notes = read();
      if (normalized) notes[cardSlug] = normalized;
      else delete notes[cardSlug];
      if (storage) {
        try { storage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch { Object.assign(memory, notes); }
      } else Object.assign(memory, notes);
      return normalized;
    },
  };
}
