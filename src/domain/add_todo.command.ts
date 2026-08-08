// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import { type TodoState } from "./todo.aggregate";

export type AddTodoCommand = Readonly<{
  type: "add-todo";
  data: AddTodoCommandData;
}>;

export type AddTodoCommandData = Readonly<{
  title: string;
}>;

export function createAddTodo(data: AddTodoCommandData): AddTodoCommand {
  return { type: "add-todo", data };
}

export function addTodo(
  state: TodoState | null,
  command: AddTodoCommand,
): Omit<TodoState, "id"> {
  if (state != null) {
    throw new TypeError("title-must-be-unique");
  }

  const title = command.data.title.trim();
  if (title === "") {
    throw new TypeError("title-must-not-be-empty");
  }

  return { title, completed: false };
}
