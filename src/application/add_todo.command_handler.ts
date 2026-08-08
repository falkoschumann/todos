// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import { addTodo, type AddTodoCommand } from "../domain/add_todo.command";
import { createTodoAdded } from "../domain/todo_added.event";
import type { TodoRepository } from "../infrastructure/todo.repository";
import type { EventBus } from "../shared/event_bus";
import { createCommandStatus, type CommandStatus } from "../shared/message";

export class AddTodoCommandHandler {
  static create({
    eventBus,
    todoRepository,
  }: {
    eventBus: EventBus;
    todoRepository: TodoRepository;
  }): AddTodoCommandHandler {
    return new AddTodoCommandHandler(eventBus, todoRepository);
  }

  #eventBus;
  #todoRepository;

  private constructor(eventBus: EventBus, todoRepository: TodoRepository) {
    this.#eventBus = eventBus;
    this.#todoRepository = todoRepository;
  }

  async handle(command: AddTodoCommand): Promise<CommandStatus> {
    const todos = await this.#todoRepository.findAll();
    let state = todos.find((todo) => todo.title === command.data.title) || null;
    const data = addTodo(state, command);
    state = await this.#todoRepository.save(data);
    const event = createTodoAdded(state);
    this.#eventBus.publish(event);
    return createCommandStatus();
  }
}
