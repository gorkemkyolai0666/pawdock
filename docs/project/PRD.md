# PawDock — Product Requirements Document

## Overview
PawDock is a comprehensive pet hotel and boarding kennel management platform designed for Turkish pet care facilities.

## Design Direction
Mobile-inspired Warm Playful — soft amber/orange accent, lavender secondary, cream backgrounds, rounded corners, Nunito headings, Inter body text.

## Target Audience
Pet hotels, dog boarding kennels, and animal care facilities in Turkey.

## Core Features
1. **Pet Profiles** — Complete animal records with species, breed, health, vaccination, diet, allergies
2. **Owner Management** — Pet owner contacts with linked pet profiles
3. **Room Management** — Room types (standard, premium, suite, outdoor, isolation), capacity, availability
4. **Booking System** — Reservation lifecycle (pending → confirmed → checked-in → checked-out)
5. **Daily Care Logs** — Feeding, walking, grooming, playtime, medication tracking
6. **Dashboard Analytics** — KPIs, revenue, occupancy, recent activity
7. **Authentication** — JWT-based auth with role management

## Tech Stack
- Backend: NestJS + Prisma + PostgreSQL
- Frontend: Next.js 14 + TypeScript + Tailwind CSS
- Deployment: Railway (backend + DB) + Vercel (frontend)

## Color Palette
- Primary: #F59E0B (Amber)
- Secondary: #8B5CF6 (Violet)
- Accent: #10B981 (Emerald)
- Background Light: #FFFBF0
- Background Dark: #1A1520
