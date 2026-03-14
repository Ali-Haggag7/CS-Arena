# CS Arena 🚀

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Sanity](https://img.shields.io/badge/Sanity-F03E2F?style=for-the-badge&logo=sanity&logoColor=white)

A modern platform for developers to discover, share, and showcase their projects — built with Next.js 15, Sanity CMS, and NextAuth.

---

## Features

- Browse and search developer projects with advanced filters
- Submit and manage your own projects
- Upvote your favorite projects
- Leaderboard for top-ranked projects
- Open-source projects section
- Developer profiles with GitHub stats
- Authentication via GitHub OAuth
- Fully responsive UI

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — browse and search projects |
| `/projects` | All projects listing |
| `/project/[id]` | Single project details |
| `/project/create` | Submit a new project |
| `/leaderboard` | Top voted projects |
| `/open-source` | Open-source projects |
| `/developers` | Developer profiles |
| `/user/[id]` | User profile page |
| `/about` | About CS Arena |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/cookies` | Cookie policy |

---

## Tech Stack

- **Framework** — Next.js 15 App Router
- **Language** — TypeScript
- **Styling** — Tailwind CSS + shadcn/ui
- **CMS** — Sanity
- **Auth** — NextAuth.js
- **Monitoring** — Sentry
- **Deployment** — Vercel

---

## Getting Started

### Prerequisites
- Node.js 18+
- Sanity account
- GitHub OAuth app

### Installation
```bash
git clone https://github.com/Ali-Haggag7/CS-Arena.git
cd CS-Arena
npm install
```

### Environment Variables

Create a `.env.local` file:
```env
NEXTAUTH_URL=
NEXTAUTH_SECRET=

AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_WRITE_TOKEN=

SENTRY_AUTH_TOKEN=
```

### Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure
```
CS-Arena/
├── app/
│   └── (root)/
│       ├── about/
│       ├── coming-soon/
│       ├── cookies/
│       ├── developers/
│       ├── leaderboard/
│       ├── open-source/
│       ├── privacy/
│       ├── project/
│       ├── projects/
│       ├── terms/
│       └── user/[id]/
├── components/
│   ├── layout/
│   ├── project/
│   ├── shadcn/
│   └── shared/
├── lib/
├── sanity/
└── hooks/
```

---

## License

MIT License — feel free to use and modify.

---

Built with by [Ali Haggag](https://github.com/Ali-Haggag7)