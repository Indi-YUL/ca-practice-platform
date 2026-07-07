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
    const body = await request.json() as {
      userId: string;
      phone: string;
      dateOfJoining: string;
      departments: string[];
      services: string[];
    };

    if (!body.userId) {
      return HttpResponse.json({ error: "Please select an existing user" }, { status: 400 });
    }

    const user = db.users.getById(body.userId);
    if (!user) {
      return HttpResponse.json({ error: "User not found" }, { status: 404 });
    }

    const account = db.appUsers.getByUserId(body.userId);
    if (!account || account.status !== "active") {
      return HttpResponse.json({ error: "User must have an active login account" }, { status: 400 });
    }

    const existingStaff = db.staff.getById(body.userId);
    if (existingStaff?.status === "active") {
      return HttpResponse.json({ error: "This user is already an active staff member" }, { status: 409 });
    }

    if (!body.phone || !body.departments?.length) {
      return HttpResponse.json({ error: "Phone and at least one department are required" }, { status: 400 });
    }

    const staffRecord = {
      ...user,
      id: body.userId,
      phone: body.phone,
      dateOfJoining: body.dateOfJoining || new Date().toISOString().split("T")[0],
      departments: body.departments,
      services: body.services || [],
      status: "active" as const,
      department: body.departments[0],
    };

    if (existingStaff) {
      db.staff.update(body.userId, staffRecord);
      return HttpResponse.json(staffRecord);
    }

    db.staff.create(staffRecord);
    return HttpResponse.json(staffRecord, { status: 201 });
  }),

  http.patch("/api/staff/:id", async ({ params, request }) => {
    await delay(300);
    const body = await request.json() as Record<string, unknown>;
    const updated = db.staff.update(params.id as string, body as any);
    if (!updated) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    return HttpResponse.json(updated);
  }),
];
