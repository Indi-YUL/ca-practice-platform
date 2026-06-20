import { http, HttpResponse, delay } from "msw";
import { db } from "../db";

export const clientHandlers = [
  http.get("/api/clients", async () => {
    await delay(300);
    return HttpResponse.json(db.clients.getAll());
  }),

  http.get("/api/clients/:id", async ({ params }) => {
    await delay(200);
    const client = db.clients.getById(params.id as string);
    if (!client) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    return HttpResponse.json(client);
  }),
];
