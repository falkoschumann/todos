// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import {
  clearCompleted,
  type ClearCompletedCommand,
} from "../domain/clear_completed.command";
import { createCompletedCleared } from "../domain/completed_cleared.event";
import type { TodoRepository } from "../infrastructure/todo.repository";
import type { EventBus } from "../shared/event_bus";
import { createCommandStatus, type CommandStatus } from "../shared/message";

export class ClearCompletedCommandHandler {
  static create({
    eventBus,
    todoRepository,
  }: {
    eventBus: EventBus;
    todoRepository: TodoRepository;
  }): ClearCompletedCommandHandler {
    return new ClearCompletedCommandHandler(eventBus, todoRepository);
  }

  #eventBus;
  #todoRepository;

  private constructor(eventBus: EventBus, todoRepository: TodoRepository) {
    this.#eventBus = eventBus;
    this.#todoRepository = todoRepository;
  }

  async handle(command: ClearCompletedCommand): Promise<CommandStatus> {
    const state = await this.#todoRepository.findAll();
    const cleared = clearCompleted(state, command);
    await this.#todoRepository.deleteAll(cleared);
    const event = createCompletedCleared(cleared);
    this.#eventBus.publish(event);
    return createCommandStatus();
  }
}
