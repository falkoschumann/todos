// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import type { TodoState } from "../domain/todo.aggregate";
import { TodoItemComponent } from "./todo_item.component";

function TodoListComponent({
  todos,
  onToggleTodo,
  onSaveTodo,
  onDestroyTodo,
}: {
  todos: TodoState[];
  onToggleTodo: (id: number) => void;
  onSaveTodo: (id: number, title: string) => void;
  onDestroyTodo: (id: number) => void;
}) {
  return (
    <ul className="list-group mb-3">
      {todos.map((todo) => (
        <TodoItemComponent
          key={todo.id}
          todo={todo}
          onToggle={() => onToggleTodo(todo.id)}
          onSave={(title) => onSaveTodo(todo.id, title)}
          onDestroy={() => onDestroyTodo(todo.id)}
        />
      ))}
    </ul>
  );
}

export default TodoListComponent;
