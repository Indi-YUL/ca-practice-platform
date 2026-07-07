import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { useChangePasswordMutation } from "@/store/api/authApi";
import { ArrowLeft, KeyRound, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/domain/models";

const roleLabels: Record<UserRole, string> = {
  partner: "Partner",
  manager: "Manager",
  staff: "Staff",
  trainee: "Trainee",
};

export function ProfilePage() {
  const { currentUser, username, accountId } = useAppSelector((state) => state.auth);
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      await changePassword({
        accountId: accountId!,
        currentPassword,
        newPassword,
      }).unwrap();
      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Current password is incorrect.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-sm text-muted-foreground">View your account details and update your password</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-lg font-semibold">{currentUser.name}</h2>
              <span className={cn("mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium", roleBadge(currentUser.role))}>
                {roleLabels[currentUser.role]}
              </span>
            </div>
            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Username</dt>
                <dd className="font-medium font-mono">{username}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{currentUser.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Office</dt>
                <dd className="font-medium">{currentUser.office}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Department</dt>
                <dd className="font-medium">{currentUser.department}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Change Password</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="mt-1 text-xs text-muted-foreground">Minimum 8 characters</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

function roleBadge(role: string): string {
  const map: Record<string, string> = {
    partner: "bg-purple-100 text-purple-700",
    manager: "bg-blue-100 text-blue-700",
    staff: "bg-green-100 text-green-700",
    trainee: "bg-yellow-100 text-yellow-700",
  };
  return map[role] || "bg-gray-100 text-gray-700";
}
