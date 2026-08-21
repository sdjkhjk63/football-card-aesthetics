"use client";

import { useEffect, useState } from "react";
import type { Locale, LocalizedText } from "@/domain/catalogue";
import { localize } from "@/domain/i18n";
import { translate } from "@/data/messages";
import type { AuthorNoteRepository } from "@/lib/authorNoteRepository";

export function CuratorNote({
  note,
  locale,
  cardSlug,
  repository,
  editable = false,
}: {
  note?: LocalizedText;
  locale: Locale;
  cardSlug?: string;
  repository?: AuthorNoteRepository;
  editable?: boolean;
}) {
  const catalogueNote = note ? localize(note, locale) : "";
  const [savedNote, setSavedNote] = useState(catalogueNote);
  const [draft, setDraft] = useState(catalogueNote);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const stored = cardSlug && repository ? repository.get(cardSlug) : null;
    const next = stored ?? catalogueNote;
    setSavedNote(next);
    setDraft(next);
  }, [cardSlug, catalogueNote, repository]);

  const save = () => {
    if (!cardSlug || !repository) return;
    const next = repository.save(cardSlug, draft);
    setSavedNote(next);
    setEditing(false);
  };

  return (
    <section className="curator-note">
      <span className="kicker">EDITORIAL</span>
      <h2>{translate("curatorNote", locale)}</h2>
      {editing ? (
        <div className="author-note-editor">
          <label>
            <span>{translate("authorNoteLabel", locale)}</span>
            <textarea value={draft} maxLength={1200} rows={6} onChange={(event) => setDraft(event.target.value)} />
          </label>
          <div>
            <button className="secondary-button" type="button" onClick={() => setEditing(false)}>{translate("cancel", locale)}</button>
            <button className="primary-button" type="button" onClick={save}>{translate("saveAuthorNote", locale)}</button>
          </div>
        </div>
      ) : (
        <>
          <p>{savedNote || translate("curatorNotePending", locale)}</p>
          {editable ? <button className="author-edit-button" type="button" onClick={() => setEditing(true)}>{translate(savedNote ? "editAuthorNote" : "writeAuthorNote", locale)}</button> : null}
        </>
      )}
    </section>
  );
}
