import { staffHandlers } from "./staff";
import { serviceHandlers } from "./services";
import { assignmentHandlers } from "./assignments";
import { clientHandlers } from "./clients";

export const handlers = [
  ...staffHandlers,
  ...serviceHandlers,
  ...assignmentHandlers,
  ...clientHandlers,
];
