import { useState } from "react";

function initForm(item) {
  return {
    name: item?.name ?? "",
    status: item?.status ?? "active",
    category: item?.category ?? "general",
    priority: item?.priority ?? "medium",
    notes: item?.notes ?? "",
  };
}

export default function DetailPanel({ item, onClose, onSave, saving }) {
  // Empty state if no item is selected. Once an item is selected, styles will appear
  const open = Boolean(item);

  return (
    <aside className={`${open ? "panel--open" : "panel panel--closed"}`}>
      {!item ? (
        <>
          <h2 className="panel__title">No item selected</h2>
          <p className="panel__hint">Click a row to view and edit details.</p>
        </>
      ) : (
        <>
           <DetailPanelInner
              key={item.id}
              item={item}
              onClose={onClose}
              onSave={onSave}
              saving={saving}
            />
        </>
      )}
    </aside>
  );
}

function DetailPanelInner({ item, onClose, onSave, saving }) {
  const [form, setForm] = useState(() => initForm(item));

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submit(e) {
    e.preventDefault();
    onSave(item.id, form);
  }

  return (
    <aside className="panel">
      <div className="panel__header">
        <h2 className="panel__title">Edit Item</h2>
        <button type="button" onClick={onClose} disabled={saving}>
          Close
        </button>
      </div>

      <form className="panel__form" onSubmit={submit}>
        <label>
          Name
          <input
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
        </label>

        <label>
          Status
          <select
            value={form.status}
            onChange={(e) => updateField("status", e.target.value)}
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
          />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </aside>
  );
}
