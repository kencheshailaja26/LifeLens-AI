import type { ActionCategory, Priority } from "@/data/actions";

export type TimelineItem = {
  id: string;
  title: string;
  /** ISO date, e.g. "2026-06-03". */
  date: string;
  category: ActionCategory;
  priority: Priority;
  source: string;
  completed: boolean;
};

/** Mock chronological view of upcoming deadlines (June 2026). */
export const timelineItems: TimelineItem[] = [
  {
    id: "t1",
    title: "Submit internship documents",
    date: "2026-06-03",
    category: "Career",
    priority: "high",
    source: "Internship_Offer.pdf",
    completed: false,
  },
  {
    id: "t2",
    title: "Pay electricity bill",
    date: "2026-06-07",
    category: "Bills",
    priority: "high",
    source: "Electricity_Bill.pdf",
    completed: false,
  },
  {
    id: "t3",
    title: "Scholarship application deadline",
    date: "2026-06-10",
    category: "Education",
    priority: "high",
    source: "Scholarship_Form.pdf",
    completed: false,
  },
  {
    id: "t4",
    title: "Passport appointment slot booking opens",
    date: "2026-06-12",
    category: "Travel",
    priority: "medium",
    source: "Passport_Notice.pdf",
    completed: false,
  },
  {
    id: "t5",
    title: "Internship joining day",
    date: "2026-06-15",
    category: "Career",
    priority: "high",
    source: "Internship_Offer.pdf",
    completed: false,
  },
  {
    id: "t6",
    title: "Campus tech meetup registration closes",
    date: "2026-06-18",
    category: "Events",
    priority: "low",
    source: "Event_Invitation.png",
    completed: false,
  },
  {
    id: "t7",
    title: "Broadband bill due",
    date: "2026-06-21",
    category: "Bills",
    priority: "medium",
    source: "Broadband_Bill.pdf",
    completed: false,
  },
  {
    id: "t8",
    title: "Flight 6E-2143 departure",
    date: "2026-06-24",
    category: "Travel",
    priority: "medium",
    source: "Flight_Ticket.png",
    completed: false,
  },
  {
    id: "t9",
    title: "Hostel checkout",
    date: "2026-06-27",
    category: "Personal",
    priority: "low",
    source: "Hostel_Notice.pdf",
    completed: false,
  },
  {
    id: "t10",
    title: "Scholarship orientation call",
    date: "2026-06-05",
    category: "Education",
    priority: "medium",
    source: "Scholarship_Email",
    completed: true,
  },
];
