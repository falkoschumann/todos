// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import { beforeEach, describe, expect, it } from "vitest";

import { ClearCompletedCommandHandler } from "../../src/application/clear_completed.command_handler";
import type { TodoState } from "../../src/domain/todo.aggregate";
import { createClearCompleted } from "../../src/domain/clear_completed.command";
import { createCompletedCleared } from "../../src/domain/completed_cleared.event";
import { TodoRepository } from "../../src/infrastructure/todo.repository";
import { EventBus } from "../../src/shared/event_bus";
import { createCommandStatus } from "../../src/shared/message";

const todo1: TodoState = { id: 1, title: "foo", completed: false };
const todo2: TodoState = { id: 2, title: "bar", completed: true };

describe("Clear completed", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should clear completed", async () => {
    const { handler, eventBus, todoRepository } = configure();
    await todoRepository.saveAll([todo1, todo2]);

    const command = createClearCompleted();
    const status = await handler.handle(command);

    expect(status).toEqual(createCommandStatus());
    expect(eventBus.getEvents()).toEqual([createCompletedCleared([todo2])]);
    const todos = await todoRepository.findAll();
    expect(todos).toEqual([todo1]);
  });
});

function configure() {
  const eventBus = EventBus.create();
  const todoRepository = TodoRepository.create();
  const handler = ClearCompletedCommandHandler.create({
    eventBus,
    todoRepository,
  });
  return { handler, eventBus, todoRepository };
}
