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

  http.post("/api/clients", async ({ request }) => {
    await delay(400);
    const body = await request.json() as Record<string, unknown>;
    const newClient = { id: `c${Date.now()}`, assignmentsCount: 0, ...body };
    db.clients.create(newClient as any);
    return HttpResponse.json(newClient, { status: 201 });
  }),

  http.patch("/api/clients/:id", async ({ params, request }) => {
    await delay(300);
    const body = await request.json() as Record<string, unknown>;
    const updated = db.clients.update(params.id as string, body as any);
    if (!updated) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    return HttpResponse.json(updated);
  }),
];
