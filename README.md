# Assistly AI

ROLE
You are an expert AI product designer, UX/UI designer, and full-stack web developer. Build a modern, professional, responsive AI productivity platform that combines an AI Research Assistant, Smart Email Generator, and Meeting Notes Summarizer in one easy-to-use website.

CONTEXT
The platform is designed to help users research topics, write professional emails, and turn meeting notes or transcripts into clear summaries and actionable tasks. The experience should be simple enough for beginners while still looking like a professional AI SaaS product.

OBJECTIVE
Create a fully functional AI productivity website with three main AI tools:

AI Research Assistant

Smart Email Generator

Meeting Notes Summarizer

The website should have a clean dashboard where users can easily switch between the three tools.

REQUIREMENTS

1. AI Research Assistant

Create a research workspace where users can:

Enter a research topic or question.

Choose the desired research depth.

Generate structured research results.

Produce summaries, key findings, important points, and conclusions.

Organize information using headings and bullet points.

Allow users to copy, edit, and download generated research.

Include a "Clear" button to start a new research request.

2. Smart Email Generator

Create an AI email-writing tool where users can:

Enter the purpose of the email.

Enter key information they want included.

Select an email tone such as:

Professional

Friendly

Formal

Casual

Persuasive

Apologetic

Generate a complete email.

Generate a subject line automatically.

Allow users to regenerate the email.

Allow users to copy and edit the generated email.

Include a "Clear" button.

3. Meeting Notes Summarizer

Create a meeting summarization tool where users can:

Paste meeting notes or a transcript.

Generate a concise meeting summary.

Extract key discussion points.

Identify decisions made.

Identify action items.

Identify important deadlines mentioned.

Display action items in a clean task-style layout.

Allow users to copy, edit, and download the summary.

Include a "Clear" button.

DASHBOARD

Create a modern dashboard containing:

Platform name/logo.

Navigation menu.

AI Research Assistant.

Smart Email Generator.

Meeting Notes Summarizer.

Recent activity section.

Quick-action cards.

Clean statistics such as "Research Created," "Emails Generated," and "Meetings Summarized."

DESIGN REQUIREMENTS

Use a modern AI SaaS design with:

Clean and professional interface.

Responsive desktop, tablet, and mobile layouts.

Attractive cards with subtle shadows.

Smooth animations and transitions.

Clear typography.

Intuitive navigation.

Professional icons.

Accessible buttons and form controls.

Light and modern visual appearance.

Loading indicators while AI tools are processing.

Helpful empty states and error messages.

AI EXPERIENCE

Each AI tool should have:

Clear input area.

Example prompts.

Generate button.

Loading state.

Generated-result area.

Copy button.

Edit button.

Regenerate button.

Clear button.

Use realistic sample/demo AI responses if a live AI API is not available. Structure the application so an AI API can be connected later.

IMPORTANT AUTHENTICATION CONSTRAINT

DO NOT INCLUDE ANY AUTHENTICATION OR USER ACCOUNT SYSTEM.

Do not create or include:

Login

Sign in

Sign up

Registration

Logout

Passwords

Forgot password

Reset password

User accounts

Authentication

Protected routes

Account creation

Social login

Google login

Microsoft login

Email verification

OTP verification

Authentication APIs

Authentication databases

User profile accounts

The application must open directly to the main dashboard and be usable immediately without requiring any authentication whatsoever.

DATA & STORAGE

Do not require a user account or authentication database. If history is needed, use temporary browser/local storage only. Make the application functional without requiring users to create accounts.

TECHNICAL REQUIREMENTS

Build a complete responsive frontend.

Use reusable components.

Keep the code clean and organized.

Include proper error handling.

Make buttons and interactions functional.

Ensure navigation works correctly.

Do not leave unnecessary placeholder pages.

Do not add authentication-related dependencies.

Do not add unnecessary backend authentication services.

OUTPUT

Deliver a polished, production-style AI productivity platform containing:

AI Research Assistant + Smart Email Generator + Meeting Notes Summarizer

The user should be able to open the website and immediately start using all three tools without logging in, signing up, creating an account, or providing authentication credentials.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/946f7c29-da06-4126-946d-9bbc34f9ecfd).

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
