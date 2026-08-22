import type { ServiceMaster } from "@/domain/models";

export const services: ServiceMaster[] = [
  { id: "s1", name: "Statutory Audit", category: "Audit", frequency: "annual", department: "Auditing & Certification" },
  { id: "s2", name: "Tax Audit", category: "Audit", frequency: "annual", department: "Auditing & Certification" },
  { id: "s3", name: "Internal Audit", category: "Audit", frequency: "quarterly", department: "Auditing & Certification" },
  { id: "s4", name: "Trust Audit", category: "Audit", frequency: "annual", department: "Auditing & Certification" },
  { id: "s5", name: "Income Tax Return", category: "Tax", frequency: "annual", department: "Income Tax & TDS" },
  { id: "s6", name: "TDS Return", category: "Tax", frequency: "quarterly", department: "Income Tax & TDS" },
  { id: "s7", name: "GST Return", category: "GST", frequency: "monthly", department: "GST & Consultancy" },
  { id: "s8", name: "Accounting & Book-keeping", category: "Accounting", frequency: "monthly", department: "Accounting" },
  { id: "s9", name: "Certification (80G/12A)", category: "Certification", frequency: "annual", department: "Auditing & Certification" },
  { id: "s10", name: "FEMA Advisory", category: "Consultancy", frequency: "one_time", department: "GST & Consultancy" },
];
