# LifeLens Dashboard

Build the initial application foundation for a web app called "LifeLens AI".
Product:
LifeLens AI
Tagline: "Turn information into action."
Core product concept:
LifeLens AI is an AI-powered personal action assistant. Users upload or paste information such as PDFs, screenshots, bills, internship documents, job offers, travel documents, application forms, emails, and notes. The system understands the information, extracts important details, converts them into actionable tasks, prioritizes those tasks, and helps users stay on top of deadlines.
IMPORTANT:
For this step, ONLY build the application foundation and visual structure. Do not implement AI document analysis yet.
TECH STACK:
- Use React + TypeScript.
- Use Tailwind CSS.
- Use reusable components.
- Use Lucide React icons or the existing icon library.
- Keep the code clean and component-based.
- Make the application fully responsive.
DESIGN STYLE:
Create a modern, premium AI productivity application.
Visual direction:
- Clean
- Minimal
- Professional
- Friendly
- Modern SaaS dashboard
- Lots of whitespace
- Rounded cards
- Subtle shadows
- Soft backgrounds
- Blue/purple AI-inspired accent colors
PRIMARY COLOR:
Use a modern blue as the primary action color.
GENERAL LAYOUT:
Desktop:
- Fixed left sidebar
- Main content area on the right
- Top header inside the main content
- Responsive mobile navigation
SIDEBAR:
At the top:
- LifeLens AI logo/icon
- Text: LifeLens AI
Navigation items:
1. Dashboard
2. Inbox
3. Actions
4. Timeline
5. AI Assistant
Below the navigation, add a secondary section:
Management:
- Documents
- Reminders
At the bottom:
- Settings
- User profile section
Each navigation item should have an appropriate icon.
TOP HEADER:
Create a clean top header containing:
- Search field
- Notification icon
- User avatar/profile
- Optional small greeting
DASHBOARD ROUTE:
Create:
/
or
/dashboard
The dashboard should initially contain placeholder sections only.
Dashboard header:
"Good morning 👋"
Subtitle:
"Here’s what needs your attention today."
Create placeholder statistic cards:
- Urgent
- Upcoming
- Completed
- Documents
Create a section called:
"Today's Actions"
For now, show sample placeholder action cards.
Create another section:
"Recent Documents"
Show placeholder document cards.
Create a right/secondary section:
"AI Insights"
Show a placeholder message:
"Your AI insights will appear here after LifeLens analyzes your information."
IMPORTANT UX:
The dashboard should feel like an "Action Center", not a traditional file manager.
The primary question the UI should answer is:
"What do I need to do?"
Create reusable components for:
- Sidebar
- Header
- StatCard
- ActionCard
- DocumentCard
- PageContainer
Do not hardcode the entire application into one component.
Create a clean folder/component structure.
Do not implement backend functionality yet.
Do not implement real AI functionality yet.
Do not add authentication yet.
Do not add database functionality yet.
Focus only on:
1. Application shell
2. Navigation
3. Dashboard layout
4. Design system
5. Responsive UI

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://lens-action-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/37e96d70-c7e1-4d5d-84a3-fae37f1635ae).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
