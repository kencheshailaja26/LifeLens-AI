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
  priority: Priority;
  category: ActionCategory;
  source: string;
  explanation?: string;
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
    priority: "high",
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
    priority: "high",
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
    priority: "medium",
    category: "Education",
    source: "Scholarship_Form.pdf",
    explanation: "The form lists Friday as the final submission date for this cycle.",
    status: "upcoming",
    completed: false,
  },
  {
    id: "ac4",
    title: "Register for event",
    description: "Confirm your seat for the campus tech meetup.",
    due: "Due Sunday",
    priority: "low",
    category: "Events",
    source: "Event_Invitation.png",
    explanation: "Registration closes on Sunday according to the invitation.",
    status: "upcoming",
    completed: false,
  },
  {
    id: "ac5",
    title: "Renew passport appointment",
    description: "Book a slot at your local passport office.",
    due: "Due Saturday",
    priority: "medium",
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
    priority: "high",
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
    priority: "low",
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
    priority: "medium",
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
    priority: "low",
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
    priority: "medium",
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
    priority: "low",
    category: "Personal",
    source: "Hostel_Notice.pdf",
    status: "completed",
    completed: true,
  },
];
