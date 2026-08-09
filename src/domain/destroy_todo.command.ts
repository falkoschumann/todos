// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import type { TodoState } from "./todo.aggregate";

export type DestroyTodoCommand = Readonly<{
  type: "destroy-todo";
  data: DestroyTodoCommandData;
}>;

export type DestroyTodoCommandData = Readonly<{
  id: number;
}>;

export function createDestroyTodoCommand(
  data: DestroyTodoCommandData,
): DestroyTodoCommand {
  return { type: "destroy-todo", data };
}

export function destroyTodo(
  state: TodoState | null,
  _command: DestroyTodoCommand,
): TodoState | null {
  if (state == null) {
    return null;
  }

  return state;
}
