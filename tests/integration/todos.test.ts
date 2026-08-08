// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import { beforeEach, describe, expect, it } from "vitest";

import type { TodoState } from "../../src/domain/todo.aggregate";
import { TodoRepository } from "../../src/infrastructure/todo.repository";

const todo1: TodoState = { id: 1, title: "foo", completed: false };
const todo2: TodoState = { id: 2, title: "bar", completed: false };

describe("Todos", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Save", () => {
    it("should save a new todo", async () => {
      const repository = TodoRepository.create();

      await repository.save({ title: "foo", completed: false });

      const todos = await repository.findAll();
      expect(todos).toEqual([todo1]);
    });

    it("should increment ID when save a new todo", async () => {
      const repository = TodoRepository.create();
      await repository.save(todo1);

      await repository.save({ title: "bar", completed: false });

      const todos = await repository.findAll();
      expect(todos).toEqual([todo1, todo2]);
    });

    it("should update an existing todo", async () => {
      const repository = TodoRepository.create();
      await repository.save({ title: "foo", completed: false });
      await repository.save({ title: "bar", completed: false });

      await repository.save({ id: 1, title: "changed", completed: true });

      const todos = await repository.findAll();
      expect(todos).toEqual([
        { id: 1, title: "changed", completed: true },
        todo2,
      ]);
    });
  });

  describe("Save all", () => {
    it("should save all todos", async () => {
      const repository = TodoRepository.create();

      await repository.saveAll([
        { title: "foo", completed: false },
        { title: "bar", completed: false },
      ]);

      const todos = await repository.findAll();
      expect(todos).toEqual([todo1, todo2]);
    });

    it("should ignore empty list when save all todos", async () => {
      const repository = TodoRepository.create();
      await repository.saveAll([{ title: "foo", completed: false }]);

      await repository.saveAll([]);

      const todos = await repository.findAll();
      expect(todos).toEqual([todo1]);
    });
  });

  describe("Find by ID", () => {
    it("should find todo by ID", async () => {
      const repository = TodoRepository.create();
      await repository.save(todo1);
      await repository.save(todo2);

      const todo = await repository.findById(2);

      expect(todo).toEqual(todo2);
    });

    it("should return null when ID does not exist", async () => {
      const repository = TodoRepository.create();
      await repository.save(todo1);
      await repository.save(todo2);

      const todo = await repository.findById(3);

      expect(todo).toBeNull();
    });
  });

  describe("Exists by ID", () => {
    it("should return true when todo exists by ID", async () => {
      const repository = TodoRepository.create();
      await repository.save(todo1);
      await repository.save(todo2);

      const exists = await repository.existsById(2);

      expect(exists).toBe(true);
    });

    it("should return false when ID does not exist", async () => {
      const repository = TodoRepository.create();
      await repository.save(todo1);
      await repository.save(todo2);

      const exists = await repository.existsById(3);

      expect(exists).toBe(false);
    });
  });

  describe("Find all", () => {
    it("should return empty list when no todos are saved", async () => {
      const repository = TodoRepository.create();

      const todo = await repository.findAll();

      expect(todo).toEqual([]);
    });

    it("should return all todos", async () => {
      const repository = TodoRepository.create();
      await repository.save(todo1);
      await repository.save(todo2);

      const todos = await repository.findAll();

      expect(todos).toEqual([todo1, todo2]);
    });
  });

  describe("Find all by ID", () => {
    it("should return todos by IDs", async () => {
      const repository = TodoRepository.create();
      await repository.save(todo1);
      await repository.save(todo2);

      const todos = await repository.findAllById([1, 2]);

      expect(todos).toEqual([todo1, todo2]);
    });

    it("should return empty list when no todos are found by IDs", async () => {
      const repository = TodoRepository.create();
      await repository.save(todo1);
      await repository.save(todo2);

      const todos = await repository.findAllById([3, 4]);

      expect(todos).toEqual([]);
    });
  });

  describe("Count", () => {
    it("should return the count of todos", async () => {
      const repository = TodoRepository.create();
      await repository.save(todo1);
      await repository.save(todo2);

      const count = await repository.count();

      expect(count).toBe(2);
    });

    it("should return 0 when no todos are saved", async () => {
      const repository = TodoRepository.create();

      const count = await repository.count();

      expect(count).toBe(0);
    });
  });

  describe("Delete by ID", () => {
    it("should delete todo by ID", async () => {
      const repository = TodoRepository.create();
      await repository.save(todo1);
      await repository.save(todo2);

      await repository.deleteById(1);

      const todos = await repository.findAll();
      expect(todos).toEqual([todo2]);
    });

    it("should ignore deleting non-existing ID", async () => {
      const repository = TodoRepository.create();
      await repository.save(todo1);
      await repository.save(todo2);

      await repository.deleteById(3);

      const todos = await repository.findAll();
      expect(todos).toEqual([todo1, todo2]);
    });
  });

  describe("Delete", () => {
    it("should delete todo by entity", async () => {
      const repository = TodoRepository.create();
      await repository.save(todo1);
      await repository.save(todo2);

      await repository.delete(todo1);

      const todos = await repository.findAll();
      expect(todos).toEqual([todo2]);
    });
  });

  describe("Delete all by ID", () => {
    it("should delete multiple todos by ID", async () => {
      const repository = TodoRepository.create();
      await repository.save(todo1);
      await repository.save(todo2);

      await repository.deleteAllById([1, 2]);

      const todos = await repository.findAll();
      expect(todos).toEqual([]);
    });
  });

  describe("Delete all", () => {
    it("should delete multiple todos by entity", async () => {
      const repository = TodoRepository.create();
      await repository.save(todo1);
      await repository.save(todo2);

      await repository.deleteAll([todo1, todo2]);

      const todos = await repository.findAll();
      expect(todos).toEqual([]);
    });

    it("should delete all todos", async () => {
      const repository = TodoRepository.create();
      await repository.save(todo1);
      await repository.save(todo2);

      await repository.deleteAll();

      const todos = await repository.findAll();
      expect(todos).toEqual([]);
    });
  });
});
