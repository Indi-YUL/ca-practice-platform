import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
export const workerOptions = {
  serviceWorker: {
    url: "/ca-practice-platform/mockServiceWorker.js",
  },
};
