// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import type { TodoState } from "../domain/todo.aggregate";
import { TodoItemComponent } from "./todo_item.component";

function TodoListComponent({
  todos,
  onToggleTodo,
  onDestroyTodo,
}: {
  todos: TodoState[];
  onToggleTodo: (id: number) => void;
  onDestroyTodo: (id: number) => void;
}) {
  return (
    <ul className="list-group mb-3">
      {todos.map((todo) => (
        <TodoItemComponent
          key={todo.id}
          todo={todo}
          onToggle={() => onToggleTodo(todo.id)}
          onDestroy={() => onDestroyTodo(todo.id)}
        />
      ))}
    </ul>
  );
}

export default TodoListComponent;
