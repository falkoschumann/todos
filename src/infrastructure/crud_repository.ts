// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

export interface CrudRepository<T, ID> {
  save(entity: T): Promise<T>;
  saveAll(entities: Iterable<T>): Promise<T[]>;
  findById(id: ID): Promise<T | null>;
  existsById(id: ID): Promise<boolean>;
  findAll(): Promise<T[]>;
  findAllById(ids: Iterable<ID>): Promise<T[]>;
  count(): Promise<number>;
  deleteById(id: ID): Promise<void>;
  delete(entity: T): Promise<void>;
  deleteAllById(ids: Iterable<ID>): Promise<void>;
  deleteAll(entities?: Iterable<T>): Promise<void>;
}
