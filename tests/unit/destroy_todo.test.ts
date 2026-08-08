// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import { beforeEach, describe, expect, it } from "vitest";

import { DestroyTodoCommandHandler } from "../../src/application/destroy_todo.command_handler";
import type { TodoState } from "../../src/domain/todo.aggregate";
import { createDestroyTodo } from "../../src/domain/destroy_todo.command";
import { createTodoDestroyed } from "../../src/domain/todo_destroyed.event";
import { TodoRepository } from "../../src/infrastructure/todo.repository";
import { EventBus } from "../../src/shared/event_bus";
import { createCommandStatus } from "../../src/shared/message";

const todo1: TodoState = { id: 1, title: "foo", completed: false };
const todo2: TodoState = { id: 2, title: "bar", completed: true };

describe("Destroy todo", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should destroy todo", async () => {
    const { handler, eventBus, todoRepository } = configure();
    await todoRepository.saveAll([todo1, todo2]);

    const command = createDestroyTodo({ id: 2 });
    const status = await handler.handle(command);

    expect(status).toEqual(createCommandStatus());
    expect(eventBus.getEvents()).toEqual([createTodoDestroyed(todo2)]);
    const todos = await todoRepository.findAll();
    expect(todos).toEqual([todo1]);
  });

  it("should ignore unknown ID", async () => {
    const { handler, eventBus, todoRepository } = configure();
    await todoRepository.saveAll([todo1, todo2]);

    const command = createDestroyTodo({ id: 3 });
    const status = await handler.handle(command);

    expect(status).toEqual(createCommandStatus());
    expect(eventBus.getEvents()).toEqual([]);
    const todos = await todoRepository.findAll();
    expect(todos).toEqual([todo1, todo2]);
  });
});

function configure() {
  const eventBus = EventBus.create();
  const todoRepository = TodoRepository.create();
  const handler = DestroyTodoCommandHandler.create({
    eventBus,
    todoRepository,
  });
  return { handler, eventBus, todoRepository };
}
