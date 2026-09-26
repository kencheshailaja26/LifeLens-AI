# LifeLens AI

> Turn information into action.

LifeLens AI is an AI-powered personal action assistant that transforms unstructured information into clear, actionable tasks.

It analyzes documents and other user-provided information, extracts important dates, deadlines, requirements, contacts, instructions, and tasks, and organizes them into a centralized action system.

## Overview

People receive important information through PDFs, internship letters, job offers, bills, application forms, travel documents, screenshots, notes, and other sources. The important actions hidden inside this information can easily be missed.

LifeLens AI helps solve this problem by turning information into structured actions and reminders.

## Core Workflow

Upload or paste information → AI analyzes it → Important details are extracted → Actions are created → Deadlines are tracked → Reminders and insights are generated

## Features

### AI-Powered Document Analysis

LifeLens AI analyzes uploaded information and extracts:

- Document type
- Summary
- Important dates
- Deadlines
- Tasks
- Required documents
- Contact information
- Amounts
- Locations
- Instructions
- Action items

The analysis is designed to stay grounded in the provided information and avoid inventing details.

### Action Center

Extracted action items are organized into a centralized Action Center where users can:

- View pending actions
- Understand what needs to be done
- Track priorities
- Mark actions as completed
- Keep completed actions synchronized across the application

### Timeline

The Timeline organizes actions according to their due dates, helping users understand upcoming responsibilities and deadlines.

### Smart Reminders

LifeLens AI automatically derives reminders from real extracted deadlines.

Reminders are organized based on urgency:

- Urgent
- Reminder
- Upcoming

Completed actions are automatically excluded from active reminders.

### Dashboard Insights

The dashboard provides actionable insights based on the user's actual LifeLens data, including:

- Overdue actions
- Actions due today
- Actions due tomorrow
- Upcoming actions
- Highest-priority pending action
- Documents requiring attention
- Deadline information

### AI Assistant

The AI Assistant uses the user's analyzed LifeLens data to answer questions about their documents, actions, deadlines, and extracted information.

Responses are grounded in the information available in the user's LifeLens data.

### Document Management

Users can view analyzed documents and access their extracted information through the application.

### Search

Users can search their stored LifeLens information to quickly find relevant documents, actions, reminders, and extracted details.

## Example Use Case

### Internship Offer

A user uploads an internship offer letter.

LifeLens AI can identify:

- Internship position
- Joining date
- Document submission deadline
- Required documents
- Office location
- HR contact information
- Joining instructions

Instead of manually searching through the document, the user receives a structured set of actions and deadlines.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend application |
| TypeScript | Type-safe development |
| Vite | Development and build tooling |
| Tailwind CSS | Styling and responsive UI |
| Lovable | Application development platform |
| Lovable AI Gateway | AI model integration |
| Google Gemini | AI-powered document analysis |
| Zod | Schema validation |
| Session Storage | Client-side persistence |

## AI Analysis

LifeLens AI uses a server-side AI analysis flow through the Lovable AI Gateway.

Documents are processed according to their type, including:

- PDF files
- Images
- Text files
- DOCX documents
- Pasted information

The AI output is validated using a structured Zod schema before being converted into application data.

The system is designed to prioritize information provided by the user and avoid inventing unsupported details.

## Application Flow

User Information
↓
Upload / Paste
↓
AI Analysis
↓
Structured Information
↓
Action Extraction
↓
Action Center
↓
Timeline + Reminders
↓
Dashboard Insights
↓
AI Assistant

## Data Flow

LifeLens AI uses a shared persisted analysis and action data model across the application.

Analyzed information flows through the main features:

Documents
↓
Analysis
↓
Actions
↓
Timeline
↓
Reminders
↓
Dashboard Insights
↓
AI Assistant

This keeps extracted information and action status synchronized across the application.

## Target Users

LifeLens AI is designed for people who regularly receive important information from multiple sources.

Primary users include:

- Students
- Interns
- Job seekers
- Young professionals
- Freelancers
- Busy professionals

## Project Structure

src/
├── components/
├── data/
├── lib/
├── routes/
└── ...

public/

The application uses reusable React components and separates routes, UI components, data handling, and utility logic.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository:

git clone https://github.com/kencheshailaja26/LifeLens-AI.git

Navigate to the project:

cd LifeLens-AI

Install dependencies:

npm install

Start the development server:

npm run dev

## Current Project Status

LifeLens AI currently includes:

- Responsive dashboard
- Document upload and analysis
- Real AI-powered document analysis
- Structured information extraction
- Action Center
- Timeline
- Smart Reminders
- Dashboard Insights
- AI Assistant
- Document management
- Search
- Persistent application data
- Action completion synchronization
- Responsive mobile layout

## Future Improvements

Potential future improvements include:

- User authentication
- Cloud database persistence
- Cross-device synchronization
- Email and calendar integrations
- Push notifications
- Additional document formats
- Advanced personalization

## License

This project is currently not distributed under an open-source license.
