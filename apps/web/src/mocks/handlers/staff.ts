import { http, HttpResponse, delay } from "msw";
import { db } from "../db";

export const staffHandlers = [
  http.get("/api/staff", async () => {
    await delay(300);
    return HttpResponse.json(db.staff.getAll());
  }),

  http.get("/api/staff/:id", async ({ params }) => {
    await delay(200);
    const staff = db.staff.getById(params.id as string);
    if (!staff) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    return HttpResponse.json(staff);
  }),

  http.post("/api/staff", async ({ request }) => {
    await delay(400);
    const body = await request.json() as Record<string, unknown>;
    const newStaff = { id: `u${Date.now()}`, ...body, status: "active" };
    db.staff.create(newStaff as any);
    return HttpResponse.json(newStaff, { status: 201 });
  }),

  http.patch("/api/staff/:id", async ({ params, request }) => {
    await delay(300);
    const body = await request.json() as Record<string, unknown>;
    const updated = db.staff.update(params.id as string, body as any);
    if (!updated) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    return HttpResponse.json(updated);
  }),
];
