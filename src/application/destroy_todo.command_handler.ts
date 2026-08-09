// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import {
  destroyTodo,
  type DestroyTodoCommand,
} from "../domain/destroy_todo.command";
import { createTodoDestroyedEvent } from "../domain/todo_destroyed.event";
import type { TodoRepository } from "../infrastructure/todo.repository";
import type { EventBus } from "../shared/event_bus";
import { createCommandStatus, type CommandStatus } from "../shared/message";

export class DestroyTodoCommandHandler {
  static create({
    eventBus,
    todoRepository,
  }: {
    eventBus: EventBus;
    todoRepository: TodoRepository;
  }): DestroyTodoCommandHandler {
    return new DestroyTodoCommandHandler(eventBus, todoRepository);
  }

  #eventBus;
  #todoRepository;

  private constructor(eventBus: EventBus, todoRepository: TodoRepository) {
    this.#eventBus = eventBus;
    this.#todoRepository = todoRepository;
  }

  async handle(command: DestroyTodoCommand): Promise<CommandStatus> {
    let state = await this.#todoRepository.findById(command.data.id);
    state = destroyTodo(state, command);
    if (state != null) {
      await this.#todoRepository.delete(state);
      const event = createTodoDestroyedEvent(state);
      this.#eventBus.publish(event);
    }
    return createCommandStatus();
  }
}
