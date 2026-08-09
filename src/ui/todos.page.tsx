// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import { type SubmitEvent, useMemo, useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router";

import { createAddTodoCommand } from "../domain/add_todo.command";
import { createClearCompletedCommand } from "../domain/clear_completed.command";
import { createDestroyTodoCommand } from "../domain/destroy_todo.command";
import { createToggleAllCommand } from "../domain/toggle_all.command";
import { createToggleTodoCommand } from "../domain/toggle_todo.command";
import { createGetTodosQueryResult, createGetTodosQuery, type GetTodosQueryResult } from "../domain/get_todos.query";
import { TodoItemComponent } from "./todo_item.component";

function TodosPage() {
  const [refreshToken, setRefreshToken] = useState(0);
  const { pathname } = useLocation();
  const query = useMemo(() => {
    switch (pathname) {
      case "/active":
        return createGetTodosQuery({ showing: "active" });
      case "/completed":
        return createGetTodosQuery({ showing: "completed" });
      default:
        return createGetTodosQuery();
    }
  }, [pathname, refreshToken]);

  const [title, setTitle] = useState("");
  const [result, setResult] = useState(createGetTodosQueryResult());

  useEffect(() => {
    const queryAsync = async () => {
      const result = await window.todos.routeMessage<GetTodosQueryResult>(query);
      setResult(result);
    };

    void queryAsync();
  }, [query]);

  const handleToggleAll = async () => {
    await window.todos.routeMessage(createToggleAllCommand({ checked: result.activeTodoCount > 0 }));
    setRefreshToken((prev) => prev + 1);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    await window.todos.routeMessage(createAddTodoCommand({ title }));
    setTitle("");
    setRefreshToken((prev) => prev + 1);
  };

  const handleToggleTodo = async (id: number) => {
    await window.todos.routeMessage(createToggleTodoCommand({ id }));
    setRefreshToken((prev) => prev + 1);
  };

  const handleDestroyTodo = async (id: number) => {
    await window.todos.routeMessage(createDestroyTodoCommand({ id }));
    setRefreshToken((prev) => prev + 1);
  };

  const handleClearCompleted = async () => {
    await window.todos.routeMessage(createClearCompletedCommand());
    setRefreshToken((prev) => prev + 1);
  };

  return (
    <div className="container my-3">
      <header>
        <h1 className="text-center">todos</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            {(result.activeTodoCount > 0 || result.completedCount > 0) && (
              <button
                type="button"
                className={`btn ${result.activeTodoCount > 0 ? "btn-outline-primary" : "btn-primary"}`}
                onClick={handleToggleAll}
              >
                <i className="bi bi-check-lg"></i>
              </button>
            )}
            <input
              className="form-control"
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(event) => setTitle(event.currentTarget.value)}
            />
          </div>
        </form>
        <ul className="list-group mb-3">
          {result.todos.map((todo) => (
            <TodoItemComponent
              key={todo.id}
              todo={todo}
              onToggle={() => handleToggleTodo(todo.id)}
              onDestroy={() => handleDestroyTodo(todo.id)}
            />
          ))}
        </ul>
      </main>
      <footer className="sticky-bottom py-2 bg-body">
        <div className="container">
          <div className="row">
            <div className="col text-start">
              {result.activeTodoCount} item{result.activeTodoCount !== 1 ? "s" : ""} left
            </div>
            <div className="col text-center">
              <div className="btn-group">
                <NavLink to="/" className="btn btn-outline-primary">
                  All
                </NavLink>
                <NavLink to="active" className="btn btn-outline-primary">
                  Active
                </NavLink>
                <NavLink to="completed" className="btn btn-outline-primary">
                  Completed
                </NavLink>
              </div>
            </div>
            <div className="col text-end">
              <button type="button" className="btn btn-primary" onClick={handleClearCompleted}>
                Clear completed
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default TodosPage;
