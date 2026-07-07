import { http, HttpResponse, delay } from "msw";
import type { AppUserAccount, AuthSession } from "@/domain/models";
import { db } from "../db";

function toSession(account: AppUserAccount): AuthSession | null {
  const user = db.users.getById(account.userId) ?? db.staff.getById(account.userId);
  if (!user || account.status !== "active") return null;
  return {
    accountId: account.id,
    user: user,
    username: account.username,
    isAdmin: account.isAdmin,
    permissions: account.permissions,
  };
}

export const authHandlers = [
  http.post("/api/auth/login", async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as { username: string; password: string };
    const account = db.appUsers.getByUsername(body.username);

    if (!account || account.password !== body.password) {
      return HttpResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }
    if (account.status !== "active") {
      return HttpResponse.json({ error: "Account is inactive" }, { status: 403 });
    }

    const session = toSession(account);
    if (!session) {
      return HttpResponse.json({ error: "User profile not found" }, { status: 404 });
    }
    return HttpResponse.json(session);
  }),

  http.get("/api/auth/session/:accountId", async ({ params }) => {
    await delay(200);
    const account = db.appUsers.getById(params.accountId as string);
    if (!account) return HttpResponse.json({ error: "Session not found" }, { status: 404 });
    const session = toSession(account);
    if (!session) return HttpResponse.json({ error: "Session expired" }, { status: 401 });
    return HttpResponse.json(session);
  }),

  http.post("/api/auth/change-password", async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as {
      accountId: string;
      currentPassword: string;
      newPassword: string;
    };

    if (!body.newPassword || body.newPassword.length < 8) {
      return HttpResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const account = db.appUsers.getById(body.accountId);
    if (!account) return HttpResponse.json({ error: "Account not found" }, { status: 404 });
    if (account.password !== body.currentPassword) {
      return HttpResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    db.appUsers.update(account.id, { password: body.newPassword });
    return HttpResponse.json({ success: true });
  }),
];
