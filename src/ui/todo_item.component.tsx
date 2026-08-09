// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import { useEffect, useRef, useState } from "react";

import type { TodoState } from "../domain/todo.aggregate";

export function TodoItemComponent({
  todo,
  onToggle,
  onSave,
  onDestroy,
}: {
  todo: TodoState;
  onToggle: () => void;
  onSave: (title: string) => void;
  onDestroy: () => void;
}) {
  const [title, setTitle] = useState(todo.title);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSave(title);
      setEditing(false);
    } else if (event.key === "Escape") {
      setTitle(todo.title);
      setEditing(false);
    }
  };

  return (
    <li className="list-group-item d-flex">
      {editing ? (
        <input
          ref={inputRef}
          className="form-control form-control-sm"
          type="text"
          autoFocus
          value={title}
          onBlur={() => setEditing(false)}
          onChange={(e) => setTitle(e.target.value)}
          onKeyUp={handleKeyDown}
        />
      ) : (
        <>
          <input type="checkbox" className="form-check-input me-2" checked={todo.completed} onChange={onToggle} />
          <label className="form-check-label flex-grow-1" onDoubleClick={() => setEditing(true)}>
            {title}
          </label>
          <button type="button" className="btn-close float-end ms-2" onClick={onDestroy}></button>
        </>
      )}
    </li>
  );
}
