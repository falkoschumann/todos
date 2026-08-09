// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import { saveTodo, type SaveTodoCommand } from "../domain/save_todo.command";
import { createTodoSavedEvent } from "../domain/todo_saved.event";
import type { TodoRepository } from "../infrastructure/todo.repository";
import type { EventBus } from "../shared/event_bus";
import { createCommandStatus, type CommandStatus } from "../shared/message";

export class SaveTodoCommandHandler {
  static create({
    eventBus,
    todoRepository,
  }: {
    eventBus: EventBus;
    todoRepository: TodoRepository;
  }): SaveTodoCommandHandler {
    return new SaveTodoCommandHandler(eventBus, todoRepository);
  }

  #eventBus;
  #todoRepository;

  private constructor(eventBus: EventBus, todoRepository: TodoRepository) {
    this.#eventBus = eventBus;
    this.#todoRepository = todoRepository;
  }

  async handle(command: SaveTodoCommand): Promise<CommandStatus> {
    try {
      let state = await this.#todoRepository.findById(command.data.id);
      state = saveTodo(state, command);
      await this.#todoRepository.save(state);
      const event = createTodoSavedEvent(state);
      this.#eventBus.publish(event);
      return createCommandStatus();
    } catch (error) {
      return createCommandStatus((error as Error).message);
    }
  }
}
