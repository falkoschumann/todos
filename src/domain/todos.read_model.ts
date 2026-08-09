// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import type { TodoState } from "./todo.aggregate";

export type TodosView = Readonly<{
  todos: TodoState[];
}>;
