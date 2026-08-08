// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import type { TodoState } from "./todo.aggregate";

export type ToggleAllCommand = Readonly<{
  type: "toggle-all";
  data: ToggleAllCommandData;
}>;

export type ToggleAllCommandData = Readonly<{
  checked: boolean;
}>;

export function createToggleAll(data: ToggleAllCommandData): ToggleAllCommand {
  return { type: "toggle-all", data };
}

export function toggleAll(
  state: TodoState[],
  command: ToggleAllCommand,
): TodoState[] {
  return state
    .filter((todo) => todo.completed !== command.data.checked)
    .map((todo) => ({ ...todo, completed: command.data.checked }));
}
