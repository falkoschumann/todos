// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import type { TodoState } from "./todo.aggregate";

export type CompletedClearedEvent = Readonly<{
  type: "clear-completed";
  data: TodoState[];
}>;

export function createCompletedCleared(
  data: TodoState[],
): CompletedClearedEvent {
  return { type: "clear-completed", data };
}
