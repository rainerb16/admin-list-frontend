import { useEffect, useState } from "react";

const EMPTY_FORM = {
  name: "",
  status: "active",
  category: "general",
  priority: "medium",
  notes: "",
};

function initForm(item, isCreating) {
  if (isCreating) return { ...EMPTY_FORM };

  return {
    name: item?.name ?? "",
    status: item?.status ?? "active",
    category: item?.category ?? "general",
    priority: item?.priority ?? "medium",
    notes: item?.notes ?? "",
  };
}

export default function DetailPanel({ item, onClose, onSave, saving, isCreating }) {
  // Panel should be visible if we're creating OR editing an item
  const open = isCreating || Boolean(item);

  const [form, setForm] = useState(() => initForm(item, isCreating));

  // When user selects a different item, or switches create/edit, reset the form
  useEffect(() => {
    setForm(initForm(item, isCreating));
  }, [item, isCreating]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Create mode: id is null
    // Edit mode: id is item.id
    onSave(isCreating ? null : item.id, form);
  }

  const disabled = saving;
  const canSave = form.name.trim().length > 0;

  return (
    <aside className={`panel ${open ? "panel--open" : "panel--empty"}`}>
      <div className="panel__header">
        <h2 className="panel__title">
          {isCreating ? "New Item" : item ? "Edit Item" : "No Item Selected"}
        </h2>

        {(isCreating || item) && (
          <button type="button" onClick={onClose} disabled={saving}>
            Close
          </button>
        )}
      </div>

      {!open ? (
        <p className="panel__hint">
          Select a row to view and edit details, or click <strong>+ New Item</strong>.
        </p>
      ) : (
        <>
          {saving && (
            <div className="panel__overlay" aria-live="polite">
              <div className="panel__overlayBox">Saving…</div>
            </div>
          )}

          <form className="panel__form" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                disabled={disabled}
                placeholder="e.g. Client Portal"
              />
            </label>

            <label>
              Status
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                disabled={disabled}
              >
                <option value="active">active</option>
                <option value="paused">paused</option>
                <option value="archived">archived</option>
              </select>
            </label>

            <label>
              Category
              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                disabled={disabled}
              >
                <option value="general">general</option>
                <option value="work">work</option>
                <option value="personal">personal</option>
              </select>
            </label>

            <label>
              Priority
              <select
                value={form.priority}
                onChange={(e) => updateField("priority", e.target.value)}
                disabled={disabled}
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </label>

            <label>
              Notes
              <textarea
                rows={4}
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                disabled={disabled}
                placeholder="Optional notes…"
              />
            </label>

            <button type="submit" disabled={disabled || !canSave}>
              {saving ? "Saving..." : "Save"}
            </button>

            {!canSave && (
              <p className="panel__hint">
                Name is required.
              </p>
            )}
          </form>
        </>
      )}  
    </aside>
  );
}
