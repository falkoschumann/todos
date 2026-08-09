// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import type { TodoState } from "./todo.aggregate";

export type TodoAddedEvent = Readonly<{
  type: "todo-added";
  data: TodoState;
}>;

export function createTodoAddedEvent(data: TodoState): TodoAddedEvent {
  return { type: "todo-added", data };
}
