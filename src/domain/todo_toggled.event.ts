// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import type { TodoState } from "./todo.aggregate";

export type TodoToggledEvent = Readonly<{
  type: "todo-toggled";
  data: TodoState;
}>;

export function createTodoToggledEvent(data: TodoState): TodoToggledEvent {
  return { type: "todo-toggled", data };
}
