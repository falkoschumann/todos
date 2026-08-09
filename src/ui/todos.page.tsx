// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import { useState, useEffect } from "react";
import { useLocation } from "react-router";

import { createAddTodoCommand } from "../domain/add_todo.command";
import { createClearCompletedCommand } from "../domain/clear_completed.command";
import { createDestroyTodoCommand } from "../domain/destroy_todo.command";
import { createGetTodosQueryResult, createGetTodosQuery, type GetTodosQueryResult } from "../domain/get_todos.query";
import { createSaveTodoCommand } from "../domain/save_todo.command";
import { createToggleAllCommand } from "../domain/toggle_all.command";
import { createToggleTodoCommand } from "../domain/toggle_todo.command";
import FilterComponent from "./filter.component";
import FormComponent from "./form.component";
import TodoListComponent from "./todo_list.component";

function TodosPage() {
  const { pathname } = useLocation();
  const [refreshToken, setRefreshToken] = useState(0);
  const [result, setResult] = useState(createGetTodosQueryResult());

  useEffect(() => {
    const query = createQuery(pathname);
    const queryAsync = async () => {
      const result = await window.todos.routeMessage<GetTodosQueryResult>(query);
      setResult(result);
    };
    void queryAsync();
  }, [pathname, refreshToken]);

  const refresh = () => setRefreshToken((t) => t + 1);

  const handleToggleAll = async (checked: boolean) => {
    await window.todos.routeMessage(createToggleAllCommand({ checked }));
    refresh();
  };

  const handleAddTodo = async (title: string) => {
    await window.todos.routeMessage(createAddTodoCommand({ title }));
    refresh();
  };

  const handleToggleTodo = async (id: number) => {
    await window.todos.routeMessage(createToggleTodoCommand({ id }));
    refresh();
  };

  const handleSaveTodo = async (id: number, title: string) => {
    await window.todos.routeMessage(createSaveTodoCommand({ id, title }));
    refresh();
  };

  const handleDestroyTodo = async (id: number) => {
    await window.todos.routeMessage(createDestroyTodoCommand({ id }));
    refresh();
  };

  const handleClearCompleted = async () => {
    await window.todos.routeMessage(createClearCompletedCommand());
    refresh();
  };

  return (
    <div className="container my-3">
      <header>
        <h1 className="text-center">todos</h1>
        <FormComponent
          activeTodoCount={result.activeTodoCount}
          completedCount={result.completedCount}
          onAddTodo={handleAddTodo}
          onToggleAll={handleToggleAll}
        />
      </header>
      <main>
        <TodoListComponent
          todos={result.todos}
          onToggleTodo={handleToggleTodo}
          onSaveTodo={handleSaveTodo}
          onDestroyTodo={handleDestroyTodo}
        />
      </main>
      <footer className="sticky-bottom py-2 bg-body">
        <FilterComponent activeTodoCount={result.activeTodoCount} onClearCompleted={handleClearCompleted} />
      </footer>
    </div>
  );
}

function createQuery(pathname: string) {
  switch (pathname) {
    case "/active":
      return createGetTodosQuery({ showing: "active" });
    case "/completed":
      return createGetTodosQuery({ showing: "completed" });
    default:
      return createGetTodosQuery();
  }
}

export default TodosPage;
