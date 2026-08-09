// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import "bootstrap";
import { HashRouter } from "react-router";

import "./style.css";
import TodosPage from "./todos.page";

function App() {
  return (
    <HashRouter>
      <TodosPage />
    </HashRouter>
  );
}

export default App;
