import { http, HttpResponse, delay } from "msw";
import { db } from "../db";

export const serviceHandlers = [
  http.get("/api/services", async () => {
    await delay(300);
    return HttpResponse.json(db.services.getAll());
  }),

  http.get("/api/services/:id", async ({ params }) => {
    await delay(200);
    const service = db.services.getById(params.id as string);
    if (!service) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    return HttpResponse.json(service);
  }),

  http.post("/api/services", async ({ request }) => {
    await delay(400);
    const body = await request.json() as Record<string, unknown>;
    const newService = { id: `s${Date.now()}`, clientCount: 0, status: "active", ...body };
    db.services.create(newService as any);
    return HttpResponse.json(newService, { status: 201 });
  }),

  http.patch("/api/services/:id", async ({ params, request }) => {
    await delay(300);
    const body = await request.json() as Record<string, unknown>;
    const updated = db.services.update(params.id as string, body as any);
    if (!updated) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    return HttpResponse.json(updated);
  }),
];
