# 🌐 KobbyOps — DevOps Portfolio Dashboard

A **next-generation DevOps portfolio** by [**Cobbina Emmanuel (Kobby-Jones)**](https://kobbyops.vercel.app).  
This interactive web dashboard is designed to function like a real DevOps control center — visualizing **CI/CD pipelines, GitHub events, cloud deployments, logs, and metrics** — all within a futuristic dashboard UI built with **Next.js**, **TypeScript**, and **TailwindCSS**.

---

## ⚡ Overview

KobbyOps isn’t just a personal portfolio — it’s an **active DevOps simulation** and **live dashboard** that demonstrates:

- Automated **GitHub Webhooks** integration  
- Real-time **log streams** and deployment pipelines  
- Live **CI/CD status visualization**  
- Dynamic **GitHub repository analytics**  
- Modern **DevOps-themed UI** built for performance and aesthetics

---

## 🧠 Core Features

### 🧩 Multi-Page DevOps Layout

Organized via Next.js App Router with dynamic panels:

- `/overview` — Profile summary, uptime stats, pipeline analytics  
- `/skills` — Dynamic JSON-based tech stack rendered with badges  
- `/projects` — Detailed DevOps project cards with tool tags  
- `/deployments` — Live CI/CD pipeline simulation (auto-redeploy + logs)  
- `/logs` — Real-time system log stream with icon-coded log types  
- `/experience` — Animated timeline of professional experiences  
- `/github` — Live GitHub repo stats (via REST API or webhooks)  
- `/dashboard` — Visual dashboard with radial and bar charts  
- `/contact` — Functional contact section with call and email actions  

---

## ☁️ Live Features (Dynamic Backend)

### 🔹 GitHub Webhook Integration

This portfolio listens to real GitHub push & workflow events.

**Webhook endpoint:**  

**Supported events:**

- `push` — Commits & branch updates  
- `workflow_run` — CI/CD runs from GitHub Actions  
- `create` — New branches/tags created  

**Setup:**

1. Go to your GitHub repo → **Settings → Webhooks**  
2. Add:

### 🔗 GitHub Webhook Configuration

**Payload URL:**  
`https://kobbyops.vercel.app/api/webhook/github`

**Content type:**  
`application/json`

**Secret:**  
Same as `GITHUB_WEBHOOK_SECRET` in your `.env.local` file

**Events:**  
Send me **everything**
3. Click **Add webhook**
4. Watch real logs appear instantly under **Logs Panel** 🔥

---

### 🔹 Supabase Integration

For persistent storage of logs and GitHub events.

**Env Variables:**

```bash
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
GITHUB_WEBHOOK_SECRET=<your-github-webhook-secret>

```

| Layer                  | Technologies                                           |
| ---------------------- | ------------------------------------------------------ |
| **Frontend**           | Next.js 15 (App Router), React 19, TypeScript          |
| **Styling**            | TailwindCSS, Framer Motion, Lucide Icons               |
| **Backend**            | Next.js API Routes (Edge Runtime), Supabase            |
| **Integrations**       | GitHub Webhooks, Google Search Console, Vercel Hosting |
| **DevOps Simulations** | Docker, ArgoCD, Jenkins (themed panels)                |

---

### ⚙️ Core Technologies

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-007acc?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-ea4c89?style=for-the-badge&logo=framer&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide%20Icons-18181b?style=for-the-badge&logo=lucide&logoColor=white)

### 🧠 Backend & Hosting

![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Edge Runtime](https://img.shields.io/badge/Edge%20Runtime-333333?style=for-the-badge&logo=vercel&logoColor=white)

### 🔗 Integrations & DevOps

![GitHub Webhooks](https://img.shields.io/badge/GitHub%20Webhooks-181717?style=for-the-badge&logo=github&logoColor=white)
![Google Search Console](https://img.shields.io/badge/Google%20Search%20Console-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-0db7ed?style=for-the-badge&logo=docker&logoColor=white)
![ArgoCD](https://img.shields.io/badge/ArgoCD-FE4C00?style=for-the-badge&logo=argo&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)

---

### Project Structure

```bash
src/
 ├── app/
 │   ├── (main)/              # Main grouped routes
 │   │   ├── layout.tsx       # Shared layout with Sidebar + TopBar
 │   │   ├── overview/page.tsx
 │   │   ├── skills/page.tsx
 │   │   ├── projects/page.tsx
 │   │   ├── deployments/page.tsx
 │   │   ├── logs/page.tsx
 │   │   ├── contact/page.tsx
 │   │   ├── experience/page.tsx
 │   │   ├── github/page.tsx
 │   │   ├── dashboard/page.tsx
 │   │   └── ...
 │   └── api/webhook/github/route.ts   # Webhook handler
 ├── components/
 │   ├── Sidebar.tsx
 │   ├── TopBar.tsx
 │   ├── panels/...
 │   └── ...
 ├── data/
 │   ├── skills.json
 │   ├── projects.json
 │   └── experience.json
 ├── public/
 │   ├── images/
 │   │   └── profile.jpeg
 │   ├── favicon.ico
 │   ├── sitemap.xml
 │   └── robots.txt

```

## 🚀 Deployment Guide

### 🔹 Local Development

```bash
git clone https://github.com/Kobby-Jones/kobbyops.git
cd kobbyops
npm install
cp .env.example .env.local
npm run dev

App will run on:  
```

 [http://localhost:3000](http://localhost:3000)

### 🔹 Production Deployment

1. Push your code to **GitHub**  
2. Connect your repo to **Vercel**  
3. Add Environment Variables in **Vercel Dashboard**:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
GITHUB_WEBHOOK_SECRET
```

4. Redeploy — your live dashboard will instantly activate 🚀

### 🧭 SEO & Indexing

| File          | Purpose                                      |
| ------------- | -------------------------------------------- |
| `sitemap.xml` | Lists all important pages for Google crawler |
| `robots.txt`  | Allows all crawlers, includes sitemap path   |
| `layout.tsx`  | Contains metadata, OG, and Twitter tags      |

This site is fully Google Search indexed under both **“KobbyOps”** and **“Cobbina Emmanuel”**.

### 🔒 Environment Variables Reference

| Variable                        | Description                                             |
| ------------------------------- | ------------------------------------------------------- |
| `GITHUB_WEBHOOK_SECRET`         | Secret token used to verify GitHub webhook signatures   |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                                    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public API key                                 |
| `NEXT_PUBLIC_SITE_URL`          | Optional absolute site URL (for OG images and sitemaps) |

## 🧰 Development Notes

- All dashboard components are modular and can be reused in any Next.js project.  
- Logs and pipeline animations are simulated but dynamically driven via state + effects.  
- All icons are powered by **Lucide-React** for a clean, modern look.  
- `page.tsx` files are **server-rendered**, ensuring full SEO and Google discoverability.

## 🧑‍💻 Author

**Cobbina Emmanuel (Kobby-Jones)**  
DevOps Engineer • Cloud Automation • CI/CD • AWS  

🌐 [kobbyops.vercel.app](https://kobbyops.vercel.app)  
🐙 [GitHub](https://github.com/Kobby-Jones)  
💼 [LinkedIn](https://www.linkedin.com/in/cobbina-emmanuel-376072209/)  
✉️ <cobbina1.emmanuel@gmail.com>  

---

## 🧠 Inspiration

> “Don’t just tell people you’re a DevOps Engineer — show them your pipelines.”  
> — *Kobby-Jones, 2025*

## 🪪 License

This project is open-sourced under the **MIT License**.

---

## 🧩 Roadmap

- ✅ Real GitHub workflow metrics (via REST API)  
- 🚀 Deployment pipeline visualizer (actual GitHub Actions tracking)  
- 💾 Supabase dashboard persistence  
- 🎨 Multi-theme support (AWS Console / Kubernetes Dashboard look)

---

## ⭐ If you like this portfolio

Give it a ⭐ on [GitHub](https://github.com/Kobby-Jones)  
and connect with me on [LinkedIn](https://www.linkedin.com/in/cobbina-emmanuel-376072209/)
