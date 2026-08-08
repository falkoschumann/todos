// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import type { TodoState } from "./todo.aggregate.ts";

export type GetTodosQuery = Readonly<{
  type: "get-todos";
  data: GetTodosQueryData;
}>;

export type GetTodosQueryData = Readonly<{
  showing: "all" | "active" | "completed";
}>;

export function createGetTodosQuery(data: GetTodosQueryData): GetTodosQuery {
  return {
    type: "get-todos",
    data,
  };
}

export type GetTodosQueryResult = Readonly<{
  todos: TodoState[];
  activeTodoCount: number;
  completedCount: number;
}>;

export function createGetTodosQueryResult({
  todos = [],
  activeTodoCount = 0,
  completedCount = 0,
}: {
  todos?: TodoState[];
  activeTodoCount?: number;
  completedCount?: number;
} = {}): GetTodosQueryResult {
  return { todos, activeTodoCount, completedCount };
}

export function getTodos(
  state: TodoState[],
  query: GetTodosQuery,
): GetTodosQueryResult {
  const activeTodoCount = state.filter((todo) => !todo.completed).length;
  const completedCount = state.filter((todo) => todo.completed).length;
  const todos = state.filter((todo) => {
    switch (query.data.showing) {
      case "all":
        return true;
      case "active":
        return !todo.completed;
      case "completed":
        return todo.completed;
    }
  });

  return createGetTodosQueryResult({ todos, activeTodoCount, completedCount });
}
