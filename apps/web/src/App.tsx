import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/ui/layouts/AppLayout";
import { DashboardPage } from "@/ui/pages/DashboardPage";
import { ClientsPage } from "@/ui/pages/ClientsPage";
import { ClientDetailPage } from "@/ui/pages/ClientDetailPage";
import { AssignmentsPage } from "@/ui/pages/AssignmentsPage";
import { AssignmentDetailPage } from "@/ui/pages/AssignmentDetailPage";
import { StaffPage } from "@/ui/pages/StaffPage";
import { StaffDetailPage } from "@/ui/pages/StaffDetailPage";
import { ServiceMasterPage } from "@/ui/pages/ServiceMasterPage";
import { CalendarPage } from "@/ui/pages/CalendarPage";
import { TimeLogPage } from "@/ui/pages/TimeLogPage";
import { AiBriefingPage } from "@/ui/pages/AiBriefingPage";

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/:id" element={<ClientDetailPage />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/assignments/:id" element={<AssignmentDetailPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/staff/:id" element={<StaffDetailPage />} />
        <Route path="/services" element={<ServiceMasterPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/time" element={<TimeLogPage />} />
        <Route path="/ai" element={<AiBriefingPage />} />
      </Route>
    </Routes>
  );
}
