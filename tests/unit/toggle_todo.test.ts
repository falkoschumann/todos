// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import { beforeEach, describe, expect, it } from "vitest";

import { ToggleTodoCommandHandler } from "../../src/application/toggle_todo.command_handler";
import type { TodoState } from "../../src/domain/todo.aggregate";
import { createToggleTodo } from "../../src/domain/toggle_todo.command";
import { createTodoToggled } from "../../src/domain/todo_toggled.event";
import { TodoRepository } from "../../src/infrastructure/todo.repository";
import { EventBus } from "../../src/shared/event_bus";
import { createCommandStatus } from "../../src/shared/message";

const todo1: TodoState = { id: 1, title: "foo", completed: false };
const todo2: TodoState = { id: 2, title: "bar", completed: true };

describe("Toggle todo", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should toggle todo", async () => {
    const { handler, eventBus, todoRepository } = configure();
    await todoRepository.saveAll([todo1, todo2]);

    const command = createToggleTodo({ id: 1 });
    const status = await handler.handle(command);

    expect(status).toEqual(createCommandStatus());
    expect(eventBus.getEvents()).toEqual([
      createTodoToggled({ id: 1, title: "foo", completed: true }),
    ]);
    const todos = await todoRepository.findAll();
    expect(todos).toEqual([{ ...todo1, completed: true }, todo2]);
  });

  it("should reject toggle for unknown id", async () => {
    const { handler, eventBus, todoRepository } = configure();
    await todoRepository.saveAll([todo1]);

    const command = createToggleTodo({ id: 2 });
    const action = () => handler.handle(command);

    expect(action).rejects.toThrow("todo-must-exist");
    expect(eventBus.getEvents()).toEqual([]);
    const todos = await todoRepository.findAll();
    expect(todos).toEqual([todo1]);
  });
});

function configure() {
  const eventBus = EventBus.create();
  const todoRepository = TodoRepository.create();
  const handler = ToggleTodoCommandHandler.create({ eventBus, todoRepository });
  return { handler, eventBus, todoRepository };
}
