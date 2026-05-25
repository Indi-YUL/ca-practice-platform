import type { Assignment } from "@/domain/models";

export const assignments: Assignment[] = [
  {
    id: "a1", clientId: "c1", clientName: "Shreeji Industries Pvt Ltd", serviceName: "Statutory Audit", period: "FY 2025-26",
    assigneeId: "u10", assigneeName: "Meera Joshi", reviewerId: "u5", reviewerName: "Ketan Mehta",
    status: "in_progress", dueDate: "2026-06-30", createdAt: "2026-04-01", updatedAt: "2026-05-20",
    tasks: [
      { id: "t1", title: "Collect trial balance from client", completed: true },
      { id: "t2", title: "Verify fixed assets register", completed: true },
      { id: "t3", title: "Bank reconciliation review", completed: false },
      { id: "t4", title: "Prepare audit report draft", completed: false },
    ],
    comments: [
      { id: "cm1", userId: "u10", userName: "Meera Joshi", type: "note", text: "Trial balance received. Starting verification.", createdAt: "2026-05-10" },
      { id: "cm2", userId: "u5", userName: "Ketan Mehta", type: "review_remark", text: "Please check the inventory valuation method — seems inconsistent with last year.", createdAt: "2026-05-18" },
    ],
    worklogs: [
      { id: "w1", userId: "u10", userName: "Meera Joshi", assignmentId: "a1", date: "2026-05-10", hours: 3, note: "Collected and reviewed trial balance" },
      { id: "w2", userId: "u10", userName: "Meera Joshi", assignmentId: "a1", date: "2026-05-15", hours: 4, note: "Fixed assets verification" },
    ],
  },
  {
    id: "a2", clientId: "c3", clientName: "Gujarat Ceramics Ltd", serviceName: "GST Return", period: "April 2026",
    assigneeId: "u9", assigneeName: "Vishal Shah", reviewerId: "u6", reviewerName: "Sneha Desai",
    status: "query_raised", dueDate: "2026-05-20", createdAt: "2026-05-01", updatedAt: "2026-05-19",
    tasks: [
      { id: "t5", title: "Download purchase register from Tally", completed: true },
      { id: "t6", title: "Reconcile with GSTR-2A", completed: true },
      { id: "t7", title: "Prepare GSTR-3B", completed: false },
      { id: "t8", title: "File on GST portal", completed: false },
    ],
    comments: [
      { id: "cm3", userId: "u9", userName: "Vishal Shah", type: "query", text: "Credit note from vendor ABC is missing in their GSTR-1. Should we claim ITC or wait?", createdAt: "2026-05-18" },
      { id: "cm4", userId: "u6", userName: "Sneha Desai", type: "note", text: "Follow up with client to confirm with vendor. Don't claim ITC until resolved.", createdAt: "2026-05-19" },
    ],
    worklogs: [
      { id: "w3", userId: "u9", userName: "Vishal Shah", assignmentId: "a2", date: "2026-05-15", hours: 2, note: "Downloaded registers and reconciled" },
    ],
  },
  {
    id: "a3", clientId: "c2", clientName: "Patel & Sons LLP", serviceName: "Income Tax Return", period: "AY 2026-27",
    assigneeId: "u7", assigneeName: "Rahul Trivedi", reviewerId: "u4", reviewerName: "Priya Sharma",
    status: "assigned", dueDate: "2026-07-31", createdAt: "2026-05-15", updatedAt: "2026-05-15",
    tasks: [
      { id: "t9", title: "Collect Form 16/16A from client", completed: false },
      { id: "t10", title: "Prepare computation of income", completed: false },
      { id: "t11", title: "Verify TDS credits with 26AS", completed: false },
      { id: "t12", title: "File ITR on portal", completed: false },
    ],
    comments: [],
    worklogs: [],
  },
  {
    id: "a4", clientId: "c8", clientName: "Anand Textiles Pvt Ltd", serviceName: "TDS Return", period: "Q4 FY 2025-26",
    assigneeId: "u11", assigneeName: "Darshan Prajapati", reviewerId: "u4", reviewerName: "Priya Sharma",
    status: "under_review", dueDate: "2026-05-15", createdAt: "2026-04-20", updatedAt: "2026-05-14",
    tasks: [
      { id: "t13", title: "Compile TDS deduction details", completed: true },
      { id: "t14", title: "Prepare Form 24Q/26Q", completed: true },
      { id: "t15", title: "Validate challan details", completed: true },
      { id: "t16", title: "File TDS return", completed: false },
    ],
    comments: [
      { id: "cm5", userId: "u11", userName: "Darshan Prajapati", type: "note", text: "Return prepared and ready for review. One challan minor mismatch — adjusted.", createdAt: "2026-05-12" },
    ],
    worklogs: [
      { id: "w4", userId: "u11", userName: "Darshan Prajapati", assignmentId: "a4", date: "2026-05-10", hours: 5, note: "Compiled all TDS data and prepared returns" },
      { id: "w5", userId: "u11", userName: "Darshan Prajapati", assignmentId: "a4", date: "2026-05-12", hours: 2, note: "Challan reconciliation and corrections" },
    ],
  },
  {
    id: "a5", clientId: "c6", clientName: "Sunshine Pharma LLP", serviceName: "Accounting & Book-keeping", period: "May 2026",
    assigneeId: "u8", assigneeName: "Pooja Bhatt",
    status: "in_progress", dueDate: "2026-06-10", createdAt: "2026-05-25", updatedAt: "2026-05-24",
    tasks: [
      { id: "t17", title: "Record purchase entries", completed: true },
      { id: "t18", title: "Record sales entries", completed: false },
      { id: "t19", title: "Bank reconciliation", completed: false },
      { id: "t20", title: "Generate trial balance", completed: false },
    ],
    comments: [],
    worklogs: [
      { id: "w6", userId: "u8", userName: "Pooja Bhatt", assignmentId: "a5", date: "2026-05-24", hours: 3, note: "Purchase entries done from Tally export" },
    ],
  },
  {
    id: "a6", clientId: "c9", clientName: "Shri Swaminarayan Trust", serviceName: "Trust Audit", period: "FY 2025-26",
    assigneeId: "u10", assigneeName: "Meera Joshi", reviewerId: "u1", reviewerName: "CA Rajesh Chauhan",
    status: "completed", dueDate: "2026-05-10", createdAt: "2026-03-15", updatedAt: "2026-05-08",
    tasks: [
      { id: "t21", title: "Verify donation receipts", completed: true },
      { id: "t22", title: "Check 85% application rule", completed: true },
      { id: "t23", title: "Prepare audit report", completed: true },
      { id: "t24", title: "Partner review and sign-off", completed: true },
    ],
    comments: [
      { id: "cm6", userId: "u1", userName: "CA Rajesh Chauhan", type: "review_remark", text: "Good work. Report looks complete. Signed off.", createdAt: "2026-05-08" },
    ],
    worklogs: [
      { id: "w7", userId: "u10", userName: "Meera Joshi", assignmentId: "a6", date: "2026-04-20", hours: 6, note: "Full audit fieldwork" },
      { id: "w8", userId: "u10", userName: "Meera Joshi", assignmentId: "a6", date: "2026-05-05", hours: 3, note: "Report drafting" },
    ],
  },
  {
    id: "a7", clientId: "c10", clientName: "NK Enterprises", serviceName: "GST Return", period: "April 2026",
    assigneeId: "u9", assigneeName: "Vishal Shah",
    status: "completed", dueDate: "2026-05-20", createdAt: "2026-05-01", updatedAt: "2026-05-18",
    tasks: [
      { id: "t25", title: "Download sales register", completed: true },
      { id: "t26", title: "Prepare GSTR-1", completed: true },
      { id: "t27", title: "Prepare GSTR-3B", completed: true },
      { id: "t28", title: "File returns", completed: true },
    ],
    comments: [],
    worklogs: [
      { id: "w9", userId: "u9", userName: "Vishal Shah", assignmentId: "a7", date: "2026-05-16", hours: 2, note: "GST return prepared and filed" },
    ],
  },
  {
    id: "a8", clientId: "c4", clientName: "Mehsana Dairy Co-op Society", serviceName: "Income Tax Return", period: "AY 2026-27",
    assigneeId: "u7", assigneeName: "Rahul Trivedi", reviewerId: "u2", reviewerName: "CA Nilesh Jain",
    status: "waiting_for_info", dueDate: "2026-07-31", createdAt: "2026-05-10", updatedAt: "2026-05-22",
    tasks: [
      { id: "t29", title: "Request audited financials from society", completed: true },
      { id: "t30", title: "Prepare computation", completed: false },
      { id: "t31", title: "File ITR-5", completed: false },
    ],
    comments: [
      { id: "cm7", userId: "u7", userName: "Rahul Trivedi", type: "query", text: "Waiting for audited financials from the society. Followed up on 20th May — they said 1 week.", createdAt: "2026-05-22" },
    ],
    worklogs: [],
  },
  {
    id: "a9", clientId: "c5", clientName: "Rajendra Shah (HUF)", serviceName: "Income Tax Return", period: "AY 2026-27",
    assigneeId: "u7", assigneeName: "Rahul Trivedi", reviewerId: "u4", reviewerName: "Priya Sharma",
    status: "in_progress", dueDate: "2026-07-31", createdAt: "2026-05-18", updatedAt: "2026-05-23",
    tasks: [
      { id: "t32", title: "Collect capital gains statements", completed: true },
      { id: "t33", title: "Verify rental income details", completed: true },
      { id: "t34", title: "Prepare computation", completed: false },
      { id: "t35", title: "File ITR-2", completed: false },
    ],
    comments: [],
    worklogs: [
      { id: "w10", userId: "u7", userName: "Rahul Trivedi", assignmentId: "a9", date: "2026-05-23", hours: 2, note: "Collected and verified income details" },
    ],
  },
  {
    id: "a10", clientId: "c11", clientName: "Balaji Infra Projects", serviceName: "Statutory Audit", period: "FY 2025-26",
    assigneeId: "u10", assigneeName: "Meera Joshi", reviewerId: "u5", reviewerName: "Ketan Mehta",
    status: "assigned", dueDate: "2026-06-15", createdAt: "2026-05-20", updatedAt: "2026-05-20",
    tasks: [
      { id: "t36", title: "Planning and risk assessment", completed: false },
      { id: "t37", title: "Substantive testing", completed: false },
      { id: "t38", title: "Management representation letter", completed: false },
      { id: "t39", title: "Draft audit report", completed: false },
    ],
    comments: [],
    worklogs: [],
  },
];
