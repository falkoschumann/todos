// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import type { TodoState } from "./todo.aggregate";

export type ClearCompletedCommand = Readonly<{
  type: "clear-completed";
  data: object;
}>;

export function createClearCompleted(): ClearCompletedCommand {
  return { type: "clear-completed", data: {} };
}

export function clearCompleted(
  state: TodoState[],
  _command: ClearCompletedCommand,
): TodoState[] {
  return state.filter((todo) => todo.completed);
}
