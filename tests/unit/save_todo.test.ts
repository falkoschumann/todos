// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import { beforeEach, describe, expect, it } from "vitest";

import { SaveTodoCommandHandler } from "../../src/application/save_todo.command_handler";
import type { TodoState } from "../../src/domain/todo.aggregate";
import { createSaveTodoCommand } from "../../src/domain/save_todo.command";
import { createTodoSavedEvent } from "../../src/domain/todo_saved.event";
import { TodoRepository } from "../../src/infrastructure/todo.repository";
import { EventBus } from "../../src/shared/event_bus";
import { createCommandStatus } from "../../src/shared/message";

const todo1: TodoState = { id: 1, title: "foo", completed: false };
const todo2: TodoState = { id: 2, title: "bar", completed: true };

describe("Save todo", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should save todo", async () => {
    const { handler, eventBus, todoRepository } = configure();
    await todoRepository.saveAll([todo1, todo2]);

    const command = createSaveTodoCommand({ id: 1, title: "lorem ipsum" });
    const status = await handler.handle(command);

    expect(status).toEqual(createCommandStatus());
    expect(eventBus.getEvents()).toEqual([
      createTodoSavedEvent({ id: 1, title: "lorem ipsum", completed: false }),
    ]);
    const todos = await todoRepository.findAll();
    expect(todos).toEqual([{ ...todo1, title: "lorem ipsum" }, todo2]);
  });

  it("should reject save with empty title", async () => {
    const { handler, eventBus, todoRepository } = configure();
    await todoRepository.saveAll([todo1]);

    const command = createSaveTodoCommand({ id: 1, title: "" });
    const status = await handler.handle(command);

    expect(status).toEqual(createCommandStatus("title-must-not-be-empty"));
    expect(eventBus.getEvents()).toEqual([]);
    const todos = await todoRepository.findAll();
    expect(todos).toEqual([todo1]);
  });

  it("should reject save with whitespace title", async () => {
    const { handler, eventBus, todoRepository } = configure();
    await todoRepository.saveAll([todo1]);

    const command = createSaveTodoCommand({ id: 1, title: "   " });
    const status = await handler.handle(command);

    expect(status).toEqual(createCommandStatus("title-must-not-be-empty"));
    expect(eventBus.getEvents()).toEqual([]);
    const todos = await todoRepository.findAll();
    expect(todos).toEqual([todo1]);
  });

  it("should reject save for unknown id", async () => {
    const { handler, eventBus, todoRepository } = configure();
    await todoRepository.saveAll([{ ...todo1 }]);

    const command = createSaveTodoCommand({ id: 2, title: "lorem ipsum" });
    const status = await handler.handle(command);

    expect(status).toEqual(createCommandStatus("todo-must-exist"));
    expect(eventBus.getEvents()).toEqual([]);
    const todos = await todoRepository.findAll();
    expect(todos).toEqual([todo1]);
  });
});

function configure() {
  const eventBus = EventBus.create();
  const todoRepository = TodoRepository.create();
  const handler = SaveTodoCommandHandler.create({ eventBus, todoRepository });
  return { handler, eventBus, todoRepository };
}
