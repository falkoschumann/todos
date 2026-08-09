// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import type { TodoState } from "./todo.aggregate";

export type TodoSavedEvent = Readonly<{
  type: "todo-saved";
  data: TodoState;
}>;

export function createTodoSavedEvent(data: TodoState): TodoSavedEvent {
  return { type: "todo-saved", data };
}
