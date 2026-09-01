import type { PriorityInput } from "@/lib/prioritize";

export type Priority = "high" | "medium" | "low";

export type ActionCategory =
  | "Career"
  | "Education"
  | "Bills"
  | "Travel"
  | "Events"
  | "Personal";

export type ActionStatus = "urgent" | "upcoming" | "completed" | "overdue";

export type ActionItem = {
  id: string;
  title: string;
  description: string;
  due: string;
  /** Signals LifeLens AI uses to compute priority. */
  signals: PriorityInput;
  /** Set when the user overrides the AI priority — always preserved. */
  manualPriority?: Priority;
  category: ActionCategory;
  source: string;
  explanation?: string;
  /** Original due string when `due` is replaced by a display label (e.g. "Completed"). */
  rawDue?: string;
  status: ActionStatus;
  completed: boolean;
};

export const actionCategories: ActionCategory[] = [
  "Career",
  "Education",
  "Bills",
  "Travel",
  "Events",
  "Personal",
];

export const initialActions: ActionItem[] = [
  {
    id: "ac1",
    title: "Submit internship documents",
    description: "Upload ID proof, academic certificate, bank details and photograph to the HR portal.",
    due: "Due tomorrow",
    signals: {
      dueInDays: 1,
      importance: "critical",
      consequence: "severe",
      blocks: "your onboarding on day one",
    },
    category: "Career",
    source: "Internship_Offer.pdf",
    explanation: "Required documents must be submitted before the onboarding deadline.",
    status: "urgent",
    completed: false,
  },
  {
    id: "ac2",
    title: "Pay electricity bill",
    description: "Bill amount ₹2,480 — a late fee applies after the due date.",
    due: "Due tomorrow",
    signals: { dueInDays: 1, importance: "significant", consequence: "severe" },
    category: "Bills",
    source: "Electricity_Bill.pdf",
    explanation: "The bill states a penalty is charged for payments made after the due date.",
    status: "urgent",
    completed: false,
  },
  {
    id: "ac3",
    title: "Complete scholarship application",
    description: "Fill the online form and attach your income certificate.",
    due: "Due Friday",
    signals: {
      dueInDays: 4,
      importance: "critical",
      consequence: "moderate",
      blocks: "the scholarship interview round",
    },
    category: "Education",
    source: "Scholarship_Form.pdf",
    explanation: "The form lists Friday as the final submission date for this cycle.",
    status: "upcoming",
    completed: false,
  },
  {
    id: "ac4",
    title: "Read event information",
    description: "Go through the agenda for the campus tech meetup and confirm your seat.",
    due: "Due next week",
    signals: { dueInDays: 9, importance: "routine", consequence: "minor" },
    category: "Events",
    source: "Event_Invitation.png",
    explanation: "Registration closes next week according to the invitation.",
    status: "upcoming",
    completed: false,
  },
  {
    id: "ac5",
    title: "Renew passport appointment",
    description: "Book a slot at your local passport office.",
    due: "Due Saturday",
    signals: {
      dueInDays: 5,
      importance: "significant",
      consequence: "moderate",
      blocks: "your visa application",
    },
    category: "Travel",
    source: "Passport_Notice.pdf",
    explanation: "Slot booking opens this week and fills quickly.",
    status: "upcoming",
    completed: false,
  },
  {
    id: "ac6",
    title: "Submit rent agreement signature",
    description: "Return the signed copy to your landlord.",
    due: "Overdue by 2 days",
    signals: { dueInDays: -2, importance: "significant", consequence: "severe" },
    category: "Personal",
    source: "Rent_Agreement_Scan.jpg",
    explanation: "The agreement required a signed copy within 7 days of receipt.",
    status: "overdue",
    completed: false,
  },
  {
    id: "ac7",
    title: "Reply to scholarship confirmation email",
    description: "Confirm attendance for the orientation call.",
    due: "Completed",
    signals: { dueInDays: 10, importance: "routine", consequence: "minor" },
    category: "Education",
    source: "Scholarship_Email",
    status: "completed",
    completed: true,
  },
  {
    id: "ac8",
    title: "Web check-in for flight 6E-2143",
    description: "Seat selected and boarding pass downloaded.",
    due: "Completed",
    signals: { dueInDays: 2, importance: "significant", consequence: "moderate" },
    category: "Travel",
    source: "Flight_Ticket.png",
    status: "completed",
    completed: true,
  },
  {
    id: "ac9",
    title: "Upload joining photograph",
    description: "Passport size photo uploaded to the HR portal.",
    due: "Completed",
    signals: { dueInDays: 6, importance: "routine", consequence: "minor" },
    category: "Career",
    source: "Internship_Offer.pdf",
    status: "completed",
    completed: true,
  },
  {
    id: "ac10",
    title: "Pay broadband bill",
    description: "Monthly broadband payment settled online.",
    due: "Completed",
    signals: { dueInDays: 3, importance: "significant", consequence: "moderate" },
    category: "Bills",
    source: "Broadband_Bill.pdf",
    status: "completed",
    completed: true,
  },
  {
    id: "ac11",
    title: "Confirm hostel checkout date",
    description: "Checkout confirmed with the warden's office.",
    due: "Completed",
    signals: { dueInDays: 12, importance: "routine", consequence: "minor" },
    category: "Personal",
    source: "Hostel_Notice.pdf",
    status: "completed",
    completed: true,
  },
];
