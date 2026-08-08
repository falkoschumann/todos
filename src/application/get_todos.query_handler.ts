// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import { getTodos, type GetTodosQuery } from "../domain/get_todos.query";
import type { TodoRepository } from "../infrastructure/todo.repository";

export class GetTodosQueryHandler {
  static create({
    todoRepository,
  }: {
    todoRepository: TodoRepository;
  }): GetTodosQueryHandler {
    return new GetTodosQueryHandler(todoRepository);
  }

  #todoRepository;

  private constructor(todoRepository: TodoRepository) {
    this.#todoRepository = todoRepository;
  }

  async handle(query: GetTodosQuery) {
    const todos = await this.#todoRepository.findAll();
    return getTodos(todos, query);
  }
}
