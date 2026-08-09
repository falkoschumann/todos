// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import type { TodoState } from "../domain/todo.aggregate";

export function TodoItemComponent({
  todo,
  onToggle,
  onDestroy,
}: {
  todo: TodoState;
  onToggle: () => void;
  onDestroy: () => void;
}) {
  return (
    <li className="list-group-item">
      <input
        id={todo.id.toString()}
        type="checkbox"
        className="form-check-input me-2"
        checked={todo.completed}
        onChange={onToggle}
      />
      <label className="form-check-label" htmlFor={todo.id.toString()}>
        {todo.title}
      </label>
      <button type="button" className="btn-close float-end ms-2" onClick={onDestroy}></button>
    </li>
  );

  // TODO remove this template code when the component is fully implemented.
  return (
    <>
      <li className="list-group-item">
        <input className="form-check-input me-2" type="checkbox" defaultChecked id="todo-1" />
        <label className="form-check-label" htmlFor="todo-1">
          foo
        </label>
        <button type="button" className="btn-close float-end ms-2"></button>
      </li>
      <li className="list-group-item">
        <input className="form-check-input me-2" type="checkbox" id="todo-2" />
        <label className="form-check-label" htmlFor="todo-2">
          bar
        </label>
        <button type="button" className="btn-close float-end ms-2"></button>
      </li>
      <li className="list-group-item d-flex align-items-center py-1">
        <input className="form-check-input me-2" type="checkbox" id="todo-3" />
        <input className="form-control form-control-sm" type="text" defaultValue="edit me" />
        <button type="button" className="btn-close float-end ms-2"></button>
      </li>
    </>
  );
}
