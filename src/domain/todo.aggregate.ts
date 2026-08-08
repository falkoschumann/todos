// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import type { AllToggledEvent } from "./all_toggled.event";
import type { CompletedClearedEvent } from "./completed_cleared.event";
import type { TodoAddedEvent } from "./todo_added.event";
import type { TodoDestroyedEvent } from "./todo_destroyed.event";
import type { TodoSavedEvent } from "./todo_saved.event";
import type { TodoToggledEvent } from "./todo_toggled.event";

export type TodoState = Readonly<{
  id: number;
  title: string;
  completed: boolean;
}>;

export type TodoEvent =
  | AllToggledEvent
  | CompletedClearedEvent
  | TodoAddedEvent
  | TodoDestroyedEvent
  | TodoSavedEvent
  | TodoToggledEvent;
