import { http, HttpResponse, delay } from "msw";
import type { AppUserAccount, UserRole } from "@/domain/models";
import { DEFAULT_PASSWORD, NO_PERMISSIONS } from "@/domain/models";
import { db } from "../db";

function enrichAccount(account: AppUserAccount) {
  const user = db.users.getById(account.userId);
  return {
    ...account,
    password: undefined,
    name: user?.name ?? "Unknown",
    email: user?.email ?? "",
    role: user?.role ?? "staff",
    office: user?.office ?? "",
    department: user?.department ?? "",
  };
}

export const appUserHandlers = [
  http.get("/api/app-users", async () => {
    await delay(300);
    return HttpResponse.json(db.appUsers.getAll().map(enrichAccount));
  }),

  http.post("/api/app-users", async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as {
      userId?: string;
      name?: string;
      email?: string;
      role?: UserRole;
      office?: string;
      department?: string;
      username: string;
      password?: string;
      isAdmin?: boolean;
      permissions?: AppUserAccount["permissions"];
      status?: AppUserAccount["status"];
    };

    if (!body.username?.trim()) {
      return HttpResponse.json({ error: "Username is required" }, { status: 400 });
    }
    if (db.appUsers.getByUsername(body.username)) {
      return HttpResponse.json({ error: "Username already exists" }, { status: 409 });
    }

    const password = body.password || DEFAULT_PASSWORD;
    if (password.length < 8) {
      return HttpResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    let userId = body.userId;
    if (!userId) {
      if (!body.name?.trim() || !body.email?.trim()) {
        return HttpResponse.json({ error: "Name and email are required" }, { status: 400 });
      }
      const newUser = db.users.create({
        id: `u${Date.now()}`,
        name: body.name.trim(),
        email: body.email.trim(),
        role: body.role ?? "staff",
        office: body.office ?? "Mehsana",
        department: body.department ?? "Income Tax & TDS",
      });
      userId = newUser.id;
    } else if (db.appUsers.getByUserId(userId)) {
      return HttpResponse.json({ error: "This user already has a login account" }, { status: 409 });
    }

    const newAccount: AppUserAccount = {
      id: `acc${Date.now()}`,
      userId,
      username: body.username.trim().toLowerCase(),
      password,
      isAdmin: body.isAdmin ?? false,
      permissions: body.permissions ?? NO_PERMISSIONS,
      status: body.status ?? "active",
    };

    db.appUsers.create(newAccount);
    return HttpResponse.json(enrichAccount(newAccount), { status: 201 });
  }),

  http.patch("/api/app-users/:id", async ({ params, request }) => {
    await delay(300);
    const body = (await request.json()) as Partial<AppUserAccount> & { password?: string };
    const existing = db.appUsers.getById(params.id as string);
    if (!existing) return HttpResponse.json({ error: "Not found" }, { status: 404 });

    if (body.username && body.username.toLowerCase() !== existing.username) {
      const taken = db.appUsers.getByUsername(body.username);
      if (taken && taken.id !== existing.id) {
        return HttpResponse.json({ error: "Username already exists" }, { status: 409 });
      }
    }

    if (body.password && body.password.length < 8) {
      return HttpResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const patch: Partial<AppUserAccount> = {};
    if (body.username) patch.username = body.username.trim().toLowerCase();
    if (body.password) patch.password = body.password;
    if (body.isAdmin !== undefined) patch.isAdmin = body.isAdmin;
    if (body.permissions) patch.permissions = body.permissions;
    if (body.status) patch.status = body.status;

    const updated = db.appUsers.update(existing.id, patch);
    return HttpResponse.json(enrichAccount(updated!));
  }),
];
