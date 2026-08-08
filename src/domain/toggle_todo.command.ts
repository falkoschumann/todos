// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import type { TodoState } from "./todo.aggregate";

export type ToggleTodoCommand = Readonly<{
  type: "toggle-todo";
  data: ToggleTodoCommandData;
}>;

export type ToggleTodoCommandData = Readonly<{
  id: number;
}>;

export function createToggleTodo(
  data: ToggleTodoCommandData,
): ToggleTodoCommand {
  return { type: "toggle-todo", data };
}

export function toggleTodo(
  state: TodoState | null,
  _command: ToggleTodoCommand,
): TodoState {
  if (state == null) {
    throw new Error("todo-must-exist");
  }

  return { ...state, completed: !state.completed };
}
