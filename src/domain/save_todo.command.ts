// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import type { TodoState } from "./todo.aggregate";

export type SaveTodoCommand = Readonly<{
  type: "save-todo";
  data: SaveTodoCommandData;
}>;

export type SaveTodoCommandData = Readonly<{
  id: number;
  title: string;
}>;

export function createSaveTodo(data: SaveTodoCommandData): SaveTodoCommand {
  return { type: "save-todo", data };
}

export function saveTodo(
  state: TodoState | null,
  command: SaveTodoCommand,
): TodoState {
  if (state == null) {
    throw new Error("todo-must-exist");
  }

  if (command.data.title.trim() === "") {
    throw new TypeError("title-must-not-be-empty");
  }

  return { ...state, title: command.data.title };
}
