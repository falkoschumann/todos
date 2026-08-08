// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import { beforeEach, describe, expect, it } from "vitest";

import { AddTodoCommandHandler } from "../../src/application/add_todo.command_handler";
import type { TodoState } from "../../src/domain/todo.aggregate";
import { createAddTodo } from "../../src/domain/add_todo.command";
import { createTodoAdded } from "../../src/domain/todo_added.event";
import { TodoRepository } from "../../src/infrastructure/todo.repository";
import { EventBus } from "../../src/shared/event_bus";
import { createCommandStatus } from "../../src/shared/message";

const todo1: TodoState = { id: 1, title: "foo", completed: false };
const todo2: TodoState = { id: 2, title: "bar", completed: false };

describe("Add todo", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should add todo", async () => {
    const { handler, eventBus, todoRepository } = configure();

    const command = createAddTodo({ title: "foo" });
    const status = await handler.handle(command);

    expect(status).toEqual(createCommandStatus());
    expect(eventBus.getEvents()).toEqual([createTodoAdded(todo1)]);
    const todos = await todoRepository.findAll();
    expect(todos).toEqual([todo1]);
  });

  it("should auto increment todo ID", async () => {
    const { handler, eventBus, todoRepository } = configure();
    await todoRepository.saveAll([todo1]);

    const command = createAddTodo({ title: "bar" });
    const status = await handler.handle(command);

    expect(status).toEqual(createCommandStatus());
    expect(eventBus.getEvents()).toEqual([createTodoAdded(todo2)]);
    const todos = await todoRepository.findAll();
    expect(todos).toEqual([todo1, todo2]);
  });

  it("should reject add todo with empty title", async () => {
    const { handler, eventBus, todoRepository } = configure();

    const command = createAddTodo({ title: "" });
    const action = () => handler.handle(command);

    expect(action).rejects.toThrow("title-must-not-be-empty");
    expect(eventBus.getEvents()).toEqual([]);
    const todos = await todoRepository.findAll();
    expect(todos).toEqual([]);
  });

  it("should reject add todo with whitespace title", async () => {
    const { handler, eventBus, todoRepository } = configure();

    const command = createAddTodo({ title: "   " });
    const action = () => handler.handle(command);

    expect(action).rejects.toThrow("title-must-not-be-empty");
    expect(eventBus.getEvents()).toEqual([]);
    const todos = await todoRepository.findAll();
    expect(todos).toEqual([]);
  });

  it("should reject add todo with duplicate title", async () => {
    const { handler, eventBus, todoRepository } = configure();
    await todoRepository.saveAll([todo1]);

    const command = createAddTodo({ title: "foo" });
    const action = () => handler.handle(command);

    expect(action).rejects.toThrow("title-must-be-unique");
    expect(eventBus.getEvents()).toEqual([]);
    const todos = await todoRepository.findAll();
    expect(todos).toEqual([todo1]);
  });
});

function configure() {
  const eventBus = EventBus.create();
  const todoRepository = TodoRepository.create();
  const handler = AddTodoCommandHandler.create({ eventBus, todoRepository });
  return { handler, eventBus, todoRepository };
}
