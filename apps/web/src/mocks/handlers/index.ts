import { staffHandlers } from "./staff";
import { serviceHandlers } from "./services";
import { assignmentHandlers } from "./assignments";
import { clientHandlers } from "./clients";
import { authHandlers } from "./auth";
import { appUserHandlers } from "./appUsers";

export const handlers = [
  ...authHandlers,
  ...appUserHandlers,
  ...staffHandlers,
  ...serviceHandlers,
  ...assignmentHandlers,
  ...clientHandlers,
];
