import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { useLoginMutation } from "@/store/api/authApi";
import { setAuthSession } from "@/store/slices/authSlice";
import { DEFAULT_PASSWORD } from "@/domain/models";
import { LogIn } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const session = await login({ username: username.trim(), password }).unwrap();
      dispatch(setAuthSession(session));
      navigate("/dashboard");
    } catch {
      setError("Invalid username or password. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <span className="text-lg font-bold text-primary-foreground">CJ</span>
          </div>
          <h1 className="text-2xl font-bold">Chauhan & Jain</h1>
          <p className="mt-1 text-sm text-muted-foreground">Practice Management Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. rajesh.chauhan"
              required
              autoFocus
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={8}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" />
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 rounded-lg bg-muted/50 p-4 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Demo credentials</p>
          <p className="mt-1">Admin: <span className="font-mono">rajesh.chauhan</span></p>
          <p>Staff: <span className="font-mono">rahul.trivedi</span></p>
          <p className="mt-1">Default password: <span className="font-mono">{DEFAULT_PASSWORD}</span></p>
        </div>
      </div>
    </div>
  );
}
