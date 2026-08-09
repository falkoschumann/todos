// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import { beforeEach, describe, expect, it } from "vitest";

import { ToggleAllCommandHandler } from "../../src/application/toggle_all.command_handler";
import type { TodoState } from "../../src/domain/todo.aggregate";
import { createToggleAllCommand } from "../../src/domain/toggle_all.command";
import { createAllToggledEvent } from "../../src/domain/all_toggled.event";
import { TodoRepository } from "../../src/infrastructure/todo.repository";
import { EventBus } from "../../src/shared/event_bus";
import { createCommandStatus } from "../../src/shared/message";

const todo1: TodoState = { id: 1, title: "foo", completed: false };
const todo2: TodoState = { id: 2, title: "bar", completed: true };

describe("Toggle all", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should toggle all", async () => {
    const { handler, eventBus, todoRepository } = configure();
    await todoRepository.saveAll([todo1, todo2]);

    const command = createToggleAllCommand({ checked: true });
    const status = await handler.handle(command);

    expect(status).toEqual(createCommandStatus());
    expect(eventBus.getEvents()).toEqual([
      createAllToggledEvent([{ ...todo1, completed: true }]),
    ]);
    const todos = await todoRepository.findAll();
    expect(todos).toEqual([{ ...todo1, completed: true }, todo2]);
  });
});

function configure() {
  const eventBus = EventBus.create();
  const todoRepository = TodoRepository.create();
  const handler = ToggleAllCommandHandler.create({ eventBus, todoRepository });
  return { handler, eventBus, todoRepository };
}
