// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import type { TodoState } from "./todo.aggregate";

export type AllToggledEvent = Readonly<{
  type: "all-toggled";
  data: TodoState[];
}>;

export function createAllToggledEvent(data: TodoState[]): AllToggledEvent {
  return { type: "all-toggled", data };
}
