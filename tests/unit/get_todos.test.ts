// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import { beforeEach, describe, expect, it } from "vitest";

import { GetTodosQueryHandler } from "../../src/application/get_todos.query_handler";
import type { TodoState } from "../../src/domain/todo.aggregate";
import {
  createGetTodosQuery,
  createGetTodosQueryResult,
} from "../../src/domain/get_todos.query";
import { TodoRepository } from "../../src/infrastructure/todo.repository";

const todo1: TodoState = { id: 1, title: "foo", completed: false };
const todo2: TodoState = { id: 2, title: "bar", completed: false };
const todo3: TodoState = { id: 3, title: "baz", completed: true };

describe("Get todos", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should show all todos", async () => {
    const { handler, todoRepository } = configure();
    await todoRepository.saveAll([todo1, todo2, todo3]);

    const query = createGetTodosQuery({ showing: "all" });
    const result = await handler.handle(query);

    expect(result).toEqual(
      createGetTodosQueryResult({
        todos: [todo1, todo2, todo3],
        activeTodoCount: 2,
        completedCount: 1,
      }),
    );
  });

  it("should show active todos", async () => {
    const { handler, todoRepository } = configure();
    await todoRepository.saveAll([todo1, todo2, todo3]);

    const query = createGetTodosQuery({ showing: "active" });
    const result = await handler.handle(query);

    expect(result).toEqual(
      createGetTodosQueryResult({
        todos: [todo1, todo2],
        activeTodoCount: 2,
        completedCount: 1,
      }),
    );
  });

  it("should show completed todos", async () => {
    const { handler, todoRepository } = configure();
    await todoRepository.saveAll([todo1, todo2, todo3]);

    const query = createGetTodosQuery({ showing: "completed" });
    const result = await handler.handle(query);

    expect(result).toEqual(
      createGetTodosQueryResult({
        todos: [todo3],
        activeTodoCount: 2,
        completedCount: 1,
      }),
    );
  });

  it("should return no todos when none exist", async () => {
    const { handler } = configure();

    const query = createGetTodosQuery();
    const result = await handler.handle(query);

    expect(result).toEqual(createGetTodosQueryResult());
  });
});

function configure() {
  const todoRepository = TodoRepository.create();
  const handler = GetTodosQueryHandler.create({ todoRepository });
  return { handler, todoRepository };
}
