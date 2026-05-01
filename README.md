# alumni-influencer-marketplace-api
A secure, scalable RESTful API for an alumni influencer marketplace featuring authentication, profile management, blind bidding, and automated daily selection with token-based access and full OpenAPI documentation.

# Alumni Influencer Marketplace API

## Overview

The Alumni Influencer Marketplace is a secure full-stack web application that allows alumni to manage professional profiles, submit blind bids for featured visibility, and provide universities with analytics about graduate outcomes and professional development trends.

The system includes authentication, profile management, education records, employment history, certifications, courses, licences, bidding, notifications, analytics, admin monitoring, API key access, CSV export, and scheduled background jobs.

## Tech Stack

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt
- Helmet
- CORS
- Rate Limiting
- node-cron
- Swagger / OpenAPI

### Frontend
- React
- Vite
- Recharts
- Axios
- React Router

## Features

- User registration and login
- Email verification
- Password reset
- Profile management
- Degree management
- Employment history management
- Certification management
- Course management
- Licence management
- Blind bidding system
- Daily winner selection using cron jobs
- Notifications with read/unread handling
- Analytics dashboard
- Admin dashboard
- API key management
- Scoped public API access
- CSV export for admin and analytics data

## Backend Setup

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

## Frontend Setup

The frontend is built using React with Vite.

### Prerequisites

- Node.js (v18 or above recommended)
- npm or yarn

---

### Installation

Navigate to the client folder:

```bash
cd client
npm install
npm run dev