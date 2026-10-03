# AI Portfolio Explorer

## Overview
A production-quality personal portfolio for **Rahul Srikanth**, featuring a modern UI and a voice-interactive AI assistant using ElevenLabs Conversational AI.

## Features
- **Modern Design**: Premium dark mode UI with glassmorphism, smooth animations, and subtle gradients.
- **AI Voice Assistant**: Conversational AI agent integrated using ElevenLabs to talk about the portfolio.
- **Responsive Layout**: Optimized for all screen sizes from mobile to large desktops.
- **Interactive Sections**: Projects, Skills, Experience, and Education with hover effects.
- **Centralized Data**: Easy to maintain portfolio architecture powered by isolated data files.

## Architecture
The project follows a clean, component-based Next.js App Router architecture:
- `app/`: Next.js App Router layout and pages
- `components/`: Modular UI components organized by section (Hero, About, Projects, VoiceAgent, etc.)
- `data/`: Centralized single-source-of-truth for all portfolio facts (skills, experience, projects)
- `lib/`: Utility functions and SDK helpers

## Tech Stack
- **Frontend**: Next.js (App Router), React, TypeScript
- **Styling**: Tailwind CSS v4, Lucide React icons
- **Animations**: Framer Motion
- **Voice AI**: ElevenLabs Conversational AI SDK (`@elevenlabs/react`)

## ElevenLabs Integration
The portfolio includes an interactive floating AI button that opens a Voice Agent panel. It uses the official `@elevenlabs/react` SDK to manage session state, microphone permissions, and audio playback.

To configure the agent in the ElevenLabs Dashboard:
1. Create a Conversational AI agent.
2. Give it a system prompt similar to:
   > "You are Rahul's AI Portfolio Assistant. Your job is to help visitors explore Rahul Srikanth's professional portfolio. You can explain Rahul's skills, projects, education, and professional experience. Only use verified portfolio information. Speak naturally and concisely."
3. Copy the Agent ID.

## Environment Variables
Create a `.env.local` file based on `.env.example`:
```
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id_here
```

## Local Development
1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Open `http://localhost:3000`

## Deployment
This project is optimized for deployment on Vercel. 
1. Push the code to a GitHub repository.
2. Import the project in Vercel.
3. Add the `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` environment variable in Vercel settings.
4. Deploy!

## Future Improvements (AI Portfolio Agent v2)
- Portfolio knowledge base integration via RAG.
- Client tools integration (e.g., website navigation, project highlighting, resume opening).
- Context-aware follow-up questions.
