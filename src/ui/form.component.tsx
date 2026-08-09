// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import { type SubmitEvent, useState } from "react";

function FormComponent({
  activeTodoCount,
  completedCount,
  onAddTodo,
  onToggleAll,
}: {
  activeTodoCount: number;
  completedCount: number;
  onAddTodo: (title: string) => void;
  onToggleAll: (checked: boolean) => void;
}) {
  const [title, setTitle] = useState("");

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    onAddTodo(title);
    setTitle("");
  };

  const handleToggleAll = () => {
    onToggleAll(activeTodoCount > 0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group mb-3">
        {(activeTodoCount > 0 || completedCount > 0) && (
          <button
            type="button"
            className={`btn ${activeTodoCount > 0 ? "btn-outline-primary" : "btn-primary"}`}
            onClick={handleToggleAll}
          >
            <i className="bi bi-check-lg"></i>
          </button>
        )}
        <input
          className="form-control"
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
        />
      </div>
    </form>
  );
}

export default FormComponent;
