import type { Action } from "@/components/cards/ActionCard";
import type { DocumentItem } from "@/components/cards/DocumentCard";

export const sampleActions: Action[] = [
  {
    id: "a1",
    title: "Submit internship joining documents",
    description: "Upload signed offer letter, ID proof and bank details to the HR portal.",
    due: "Today, 6:00 PM",
    source: "Internship_Offer.pdf",
    priority: "urgent",
  },
  {
    id: "a2",
    title: "Pay electricity bill",
    description: "Bill amount ₹2,480 — late fee applies after the due date.",
    due: "Tomorrow",
    source: "Aug_Electricity_Bill.pdf",
    priority: "urgent",
  },
  {
    id: "a3",
    title: "Web check-in for flight 6E-2143",
    description: "Check-in opens 48 hours before departure. Seat selection recommended.",
    due: "In 2 days",
    source: "Flight_Ticket.png",
    priority: "soon",
  },
  {
    id: "a4",
    title: "Renew passport appointment slot",
    description: "Slot booking window opens this week for your local office.",
    due: "This week",
    source: "Passport_Notice.pdf",
    priority: "later",
  },
  {
    id: "a5",
    title: "Reply to scholarship confirmation email",
    description: "Confirm attendance for the orientation call.",
    due: "Completed",
    source: "Scholarship_Email",
    priority: "later",
    done: true,
  },
];

export const sampleDocuments: DocumentItem[] = [
  { id: "d1", name: "Internship_Offer.pdf", kind: "pdf", meta: "Added 2 hours ago · 4 actions", status: "Analyzed" },
  { id: "d2", name: "Aug_Electricity_Bill.pdf", kind: "bill", meta: "Added yesterday · 1 action", status: "Analyzed" },
  { id: "d3", name: "Flight_Ticket.png", kind: "travel", meta: "Added 3 days ago · 2 actions", status: "Analyzed" },
  { id: "d4", name: "Rent_Agreement_Scan.jpg", kind: "image", meta: "Added last week", status: "Pending" },
];
