// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

export type TodoDestroyedEvent = Readonly<{
  type: "todo-destroyed";
  data: TodoDestroyedEventData;
}>;

export type TodoDestroyedEventData = Readonly<{
  id: number;
}>;

export function createTodoDestroyedEvent(
  data: TodoDestroyedEventData,
): TodoDestroyedEvent {
  return { type: "todo-destroyed", data };
}
