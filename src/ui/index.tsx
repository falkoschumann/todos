// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import "bootstrap";
import { type SubmitEvent, useState, useEffect } from "react";

import { TodoItemComponent } from "./todo_item.component";

import { createAddTodoCommand } from "../domain/add_todo.command";
import { createClearCompletedCommand } from "../domain/clear_completed.command";
import { createDestroyTodoCommand } from "../domain/destroy_todo.command";
import { createToggleAllCommand } from "../domain/toggle_all.command";
import { createToggleTodoCommand } from "../domain/toggle_todo.command";
import { createGetTodosQueryResult, createGetTodosQuery, type GetTodosQueryResult } from "../domain/get_todos.query";
import "./style.css";

function App() {
  const [title, setTitle] = useState("");
  const [query, setQuery] = useState(createGetTodosQuery());
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
    setQuery(createGetTodosQuery(query.data));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    await window.todos.routeMessage(createAddTodoCommand({ title }));
    setTitle("");
    setQuery(createGetTodosQuery(query.data));
  };

  const handleToggleTodo = async (id: number) => {
    await window.todos.routeMessage(createToggleTodoCommand({ id }));
    setQuery(createGetTodosQuery(query.data));
  };

  const handleDestroyTodo = async (id: number) => {
    await window.todos.routeMessage(createDestroyTodoCommand({ id }));
    setQuery(createGetTodosQuery(query.data));
  };

  const handleClearCompleted = async () => {
    await window.todos.routeMessage(createClearCompletedCommand());
    setQuery(createGetTodosQuery(query.data));
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
        <nav className="navbar">
          <div className="container">
            <div>
              {result.activeTodoCount} item{result.activeTodoCount !== 1 ? "s" : ""} left
            </div>
            <div className="btn-group">
              <a href="#" className="btn btn-outline-primary active" aria-current="page">
                All
              </a>
              <a href="#" className="btn btn-outline-primary">
                Active
              </a>
              <a href="#" className="btn btn-outline-primary">
                Completed
              </a>
            </div>
            <button type="button" className="btn btn-primary" onClick={handleClearCompleted}>
              Clear completed
            </button>
          </div>
        </nav>
      </footer>
    </div>
  );
}

export default App;
