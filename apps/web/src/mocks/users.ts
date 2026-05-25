import type { User } from "@/domain/models";

export const users: User[] = [
  { id: "u1", name: "CA Rajesh Chauhan", email: "rajesh@cjca.in", role: "partner", office: "Mehsana", department: "Auditing & Certification" },
  { id: "u2", name: "CA Nilesh Jain", email: "nilesh@cjca.in", role: "partner", office: "Mehsana", department: "Income Tax & TDS" },
  { id: "u3", name: "CA Amit Patel", email: "amit@cjca.in", role: "partner", office: "Ahmedabad", department: "GST & Consultancy" },
  { id: "u4", name: "Priya Sharma", email: "priya@cjca.in", role: "manager", office: "Mehsana", department: "Income Tax & TDS" },
  { id: "u5", name: "Ketan Mehta", email: "ketan@cjca.in", role: "manager", office: "Mehsana", department: "Auditing & Certification" },
  { id: "u6", name: "Sneha Desai", email: "sneha@cjca.in", role: "manager", office: "Ahmedabad", department: "GST & Consultancy" },
  { id: "u7", name: "Rahul Trivedi", email: "rahul@cjca.in", role: "staff", office: "Mehsana", department: "Income Tax & TDS" },
  { id: "u8", name: "Pooja Bhatt", email: "pooja@cjca.in", role: "staff", office: "Mehsana", department: "Accounting" },
  { id: "u9", name: "Vishal Shah", email: "vishal@cjca.in", role: "staff", office: "Ahmedabad", department: "GST & Consultancy" },
  { id: "u10", name: "Meera Joshi", email: "meera@cjca.in", role: "staff", office: "Mehsana", department: "Auditing & Certification" },
  { id: "u11", name: "Darshan Prajapati", email: "darshan@cjca.in", role: "trainee", office: "Mehsana", department: "Income Tax & TDS" },
  { id: "u12", name: "Riya Pandya", email: "riya@cjca.in", role: "trainee", office: "Ahmedabad", department: "Accounting" },
];

export const currentUserIds = {
  partner: "u1",
  manager: "u4",
  staff: "u7",
};
