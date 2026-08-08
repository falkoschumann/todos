// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import type { TodoState } from "../domain/todo.aggregate";
import type { CrudRepository } from "./crud_repository";

const STORAGE_KEY = "todos";

export type TodoData = Omit<TodoState, "id"> & { id?: number };

export class TodoRepository implements CrudRepository<TodoData, number> {
  static create() {
    return new TodoRepository();
  }

  async save(todo: TodoData): Promise<TodoState> {
    const changed = await this.saveAll([todo]);
    return changed[0]!;
  }

  async saveAll(todos: Iterable<TodoData>): Promise<TodoState[]> {
    let stored = await this.#load();
    let changed: TodoState[] = [];
    for (const todo of todos) {
      if (todo.id == null) {
        const lastId = stored
          .map((todo) => todo.id)
          .reduce((max, id) => Math.max(max, id), 0);
        const added = { ...todo, id: lastId + 1 };
        changed = [...changed, added];
        stored = [...stored, added];
      } else {
        const index = stored.findIndex((t) => t.id === todo.id);
        if (index === -1) {
          const added = todo as TodoState;
          changed = [...changed, added];
          stored = [...stored, added];
        } else {
          const updated = todo as TodoState;
          changed = [...changed, updated];
          stored = stored.toSpliced(index, 1, updated);
        }
      }
    }
    await this.#store(stored);
    return changed;
  }

  async findById(id: number): Promise<TodoState | null> {
    const todos = await this.#load();
    return todos.find((todo) => todo.id === id) ?? null;
  }

  async existsById(id: number): Promise<boolean> {
    const todos = await this.#load();
    return todos.some((todo) => todo.id === id);
  }

  async findAll(): Promise<TodoState[]> {
    return this.#load();
  }

  async findAllById(ids: Iterable<number>): Promise<TodoState[]> {
    const idsArray = Array.from(ids);
    const todos = await this.#load();
    return todos.filter((todo) => idsArray.includes(todo.id));
  }

  async count(): Promise<number> {
    const todos = await this.#load();
    return todos.length;
  }

  async deleteById(id: number): Promise<void> {
    await this.deleteAllById([id]);
  }

  async delete(entity: TodoState): Promise<void> {
    await this.deleteById(entity.id);
  }

  async deleteAllById(ids: Iterable<number>): Promise<void> {
    const idsArray = Array.from(ids);
    let todos = await this.#load();
    todos = todos.filter((todo) => !idsArray.includes(todo.id));
    await this.#store(todos);
  }

  async deleteAll(entities?: Iterable<TodoState>): Promise<void> {
    if (entities) {
      const ids = Array.from(entities, (todo) => todo.id);
      await this.deleteAllById(ids);
    } else {
      await this.#store([]);
    }
  }

  async #load(): Promise<TodoState[]> {
    const todosJson = localStorage.getItem(STORAGE_KEY);
    if (!todosJson) {
      return [];
    }

    return JSON.parse(todosJson) as TodoState[];
  }

  async #store(todos: Iterable<TodoData>): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }
}
