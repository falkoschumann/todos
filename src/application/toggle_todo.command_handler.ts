// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import {
  toggleTodo,
  type ToggleTodoCommand,
} from "../domain/toggle_todo.command";
import { createTodoToggledEvent } from "../domain/todo_toggled.event";
import type { TodoRepository } from "../infrastructure/todo.repository";
import type { EventBus } from "../shared/event_bus";
import { createCommandStatus, type CommandStatus } from "../shared/message";

export class ToggleTodoCommandHandler {
  static create({
    eventBus,
    todoRepository,
  }: {
    eventBus: EventBus;
    todoRepository: TodoRepository;
  }): ToggleTodoCommandHandler {
    return new ToggleTodoCommandHandler(eventBus, todoRepository);
  }

  #eventBus;
  #todoRepository;

  private constructor(eventBus: EventBus, todoRepository: TodoRepository) {
    this.#eventBus = eventBus;
    this.#todoRepository = todoRepository;
  }

  async handle(command: ToggleTodoCommand): Promise<CommandStatus> {
    try {
      let state = await this.#todoRepository.findById(command.data.id);
      state = toggleTodo(state, command);
      await this.#todoRepository.save(state);
      const event = createTodoToggledEvent(state);
      this.#eventBus.publish(event);
      return createCommandStatus();
    } catch (error) {
      return createCommandStatus((error as Error).message);
    }
  }
}
