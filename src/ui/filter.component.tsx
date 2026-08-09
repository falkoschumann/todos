// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import { NavLink } from "react-router";

function FilterComponent({
  activeTodoCount,
  onClearCompleted,
}: {
  activeTodoCount: number;
  onClearCompleted: () => void;
}) {
  return (
    <div className="row">
      <div className="col text-start">
        {activeTodoCount} item{activeTodoCount !== 1 ? "s" : ""} left
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
        <button type="button" className="btn btn-primary" onClick={onClearCompleted}>
          Clear completed
        </button>
      </div>
    </div>
  );
}

export default FilterComponent;
