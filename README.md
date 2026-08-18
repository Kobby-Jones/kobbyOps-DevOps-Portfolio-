# Cobbina Emmanuel — Professional Portfolio

A content-first portfolio for **Cobbina Emmanuel**, a Software & Cloud Engineer in Ghana. The site presents professional experience, technical capabilities, detailed project case studies, blogs, engineering insights, contact channels, private publishing tools, and privacy-friendly traffic analytics.

The visual identity keeps the original KobbyOps dark zinc, teal, and emerald palette, while replacing the simulated DevOps dashboard with a conventional professional website and top navigation.

- Live site: [kobbyops.vercel.app](https://kobbyops.vercel.app)
- GitHub: [Kobby-Jones](https://github.com/Kobby-Jones)
- LinkedIn: [Cobbina Emmanuel](https://www.linkedin.com/in/cobbina-emmanuel)

## What is included

- Professional homepage with a clear personal positioning statement
- Responsive top navigation and mobile menu
- Current profile, experience, education, AWS certifications, and downloadable CV
- Tool-specific icons throughout the skills section
- Project case studies with real repository links
- Architecture image and animated GIF support on project pages
- Separate blog and engineering-insights sections
- Markdown-based article rendering
- Private `/admin` publishing area for blogs and insights
- Draft and published content states
- Privacy-friendly page-view and unique-visitor analytics
- Contact form with database storage and an email fallback
- Dynamic sitemap, robots policy, RSS feed, web manifest, and social preview image
- Person, WebSite, CollectionPage, SoftwareSourceCode, BlogPosting, and TechArticle structured data
- Per-page canonical URLs, titles, descriptions, and social metadata
- Responsive, accessible, keyboard-friendly interface

## Technology

| Area | Technology |
| --- | --- |
| Application | Next.js 16 App Router, React 19, TypeScript |
| Styling | Tailwind CSS 4 and a custom design system |
| Icons | Lucide and React Icons |
| Rich content | Markdown rendered with `react-markdown` |
| Database | Supabase PostgreSQL |
| Hosting | Vercel-ready configuration |
| SEO | Next.js Metadata API, JSON-LD, sitemap, robots, RSS, semantic HTML |

## Important routes

| Route | Purpose |
| --- | --- |
| `/` | Main professional landing page |
| `/about` | Biography, experience, education, certifications, and skills |
| `/projects` | Project collection |
| `/projects/[slug]` | Full project case study, repositories, architecture, and media |
| `/blog` | Long-form technical writing |
| `/blog/[slug]` | Individual blog post |
| `/insights` | Shorter engineering perspectives |
| `/insights/[slug]` | Individual insight |
| `/contact` | Contact channels and message form |
| `/admin` | Private publishing and analytics console |
| `/sitemap.xml` | Dynamic search-engine sitemap |
| `/robots.txt` | Search crawler policy |
| `/feed.xml` | RSS feed for all published writing |

The old `/dashboard`, `/deployments`, `/logs`, and `/github` simulation routes were intentionally removed.

## Run locally

### 1. Clone the repository

```bash
git clone https://github.com/Kobby-Jones/kobbyOps-DevOps-Portfolio-.git
cd kobbyOps-DevOps-Portfolio-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

Copy `.env.example` to `.env.local`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

macOS or Linux:

```bash
cp .env.example .env.local
```

The site can run without Supabase. In that mode:

- starter articles and all project case studies still work;
- the contact form opens the visitor's email application;
- admin publishing and analytics remain disabled.

### 4. Start development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Validate a production build

```bash
npm run lint
npm run build
```

Do not deploy a content or code change until both commands pass.

## Configure Supabase

Supabase provides persistent blog/insight content, analytics, and contact messages.

### 1. Create a Supabase project

1. Sign in to Supabase.
2. Create a new project.
3. Wait for the database to become ready.
4. Open **SQL Editor**.
5. Open [`supabase/schema.sql`](./supabase/schema.sql) from this repository.
6. Copy the complete SQL into the editor.
7. Select **Run**.

The script creates:

- `content_items` for blogs and insights;
- `site_events` for anonymous page analytics;
- `contact_messages` for enquiries;
- indexes, an updated-time trigger, and Row Level Security policies.

### 2. Copy the API settings

In Supabase, open **Project Settings → API** and copy:

- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- service role key → `SUPABASE_SERVICE_ROLE_KEY`

`SUPABASE_SERVICE_ROLE_KEY` is a server secret. Never prefix it with `NEXT_PUBLIC_`, put it in a client component, paste it into an issue, or commit it.

### 3. Configure the admin account

Set these values in `.env.local` and in the Vercel project:

```dotenv
ADMIN_PASSWORD=use-a-long-unique-password
ADMIN_SESSION_SECRET=use-a-long-random-secret
ANALYTICS_SALT=use-a-different-random-secret
```

You can generate a random secret with Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use a password manager to create and store the admin password.

### 4. Test the integration

1. Restart the development server after editing `.env.local`.
2. Open `/admin`.
3. Sign in with `ADMIN_PASSWORD`.
4. Create a draft insight.
5. Change its status to **Published**.
6. Open the public link from the content list.
7. Visit two or three public pages.
8. Return to the **Analytics** tab and confirm that views appear.

## Publish a blog or insight

### Recommended: use the admin area

1. Open `https://your-domain.com/admin`.
2. Sign in.
3. Select **New publication**.
4. Choose **Blog** or **Insight**.
5. Enter the title.
6. Leave the slug empty to generate it from the title, or enter a stable lowercase slug.
7. Write a concise excerpt. It becomes the listing description and default search description.
8. Write the article in Markdown.
9. Add comma-separated topic tags.
10. Add an optional cover-image URL.
11. Complete the SEO title and description when a more search-focused version is useful.
12. Save as **Draft** for review.
13. Change the status to **Published** when ready.

Published database content is server-rendered, included in the dynamic sitemap, and added to the RSS feed. A database article with the same slug as a starter source article overrides that starter article.

### Alternative: publish from source

Starter articles are stored in:

```text
src/content/articles.ts
```

Add a new object that satisfies the `Article` interface in:

```text
src/content/types.ts
```

Use `type: "blog"` for a blog post and `type: "insight"` for an insight. Then run lint and build before deployment.

## Add a new project

Projects use a structured source file because case studies contain richer fields, multiple repositories, capabilities, architecture media, and outcomes.

Open:

```text
src/content/projects.ts
```

Copy an existing project object and update every field:

```ts
{
  slug: "stable-project-url",
  title: "Project Name",
  eyebrow: "Platform engineering · DevOps",
  summary: "A clear two-sentence summary.",
  challenge: "The real problem or constraint.",
  solution: "What you designed and implemented.",
  outcome: "The verified result or capability.",
  stack: ["AWS", "Docker", "Kubernetes"],
  capabilities: [
    "Capability one",
    "Capability two"
  ],
  repositories: [
    {
      label: "Source repository",
      url: "https://github.com/Kobby-Jones/actual-repository"
    }
  ],
  year: "2026",
  featured: true
}
```

Project rules:

- Use a real public repository URL, not the generic GitHub profile.
- Keep the slug stable after publication.
- Do not publish invented uptime, user, performance, or success figures.
- Describe your own contribution precisely when a project has collaborators.
- Put the problem and system design before the list of tools.
- Use `featured: true` only for the strongest current work.

The project automatically receives a detail route, metadata, structured data, sitemap entry, and a card on `/projects`.

## Add an architecture diagram, screenshot, or GIF

### Recommended local structure

Create a folder matching the project slug:

```text
public/projects/stable-project-url/
```

Add files such as:

```text
architecture.png
data-flow.gif
deployment.png
```

Then add a `media` array to the project:

```ts
media: [
  {
    type: "image",
    url: "/projects/stable-project-url/architecture.png",
    alt: "Architecture of the project from client to database",
    caption: "Request flow across the public app, API, worker, and database."
  },
  {
    type: "gif",
    url: "/projects/stable-project-url/data-flow.gif",
    alt: "Animated data flow through the platform",
    caption: "Animated request-processing sequence."
  }
]
```

You may also use a stable raw GitHub URL. Local assets are preferable when you control the file and want the portfolio to remain independent of repository renames.

Media guidance:

- Use descriptive alt text that explains the information in the visual.
- Use captions to interpret the diagram, not repeat the alt text.
- Compress PNG and WebP files before committing.
- Keep text inside diagrams large enough to read on mobile.
- Use GIF only when motion explains sequence or state; use PNG or SVG for static architecture.
- Never expose tokens, internal IP addresses, private customer data, or credentials in screenshots.

## Update profile, experience, skills, or contact details

| Content | File |
| --- | --- |
| Name, email, phone, location, URLs | `src/lib/site.ts` |
| Experience and certifications | `src/content/profile.ts` |
| Skills and icon identifiers | `src/content/profile.ts` |
| Downloadable CV | `public/resume/Cobbina-Emmanuel-CV.pdf` |
| Project case studies | `src/content/projects.ts` |
| Starter blogs and insights | `src/content/articles.ts` |

When replacing the CV, keep the same filename so existing links remain valid.

## Skill icons

The icon mapping is in:

```text
src/components/site/SkillGrid.tsx
```

Brand icons come from `react-icons`, while practice-oriented skills use Lucide icons. To add a tool:

1. Add the skill in `src/content/profile.ts`.
2. Import the matching icon in `SkillGrid.tsx`.
3. Add it to `brandIcons` or `practiceIcons`.
4. Run `npm run lint` and `npm run build`.

## Analytics and privacy

The page tracker records:

- route path;
- event time;
- referring hostname;
- a salted hash of a random browser identifier.

It does not write the visitor's IP address to the portfolio database. Tracking is skipped when the browser sends `Do Not Track: 1`.

The admin dashboard shows:

- total page views;
- pseudonymous unique visitors;
- views in the last 30 days;
- a 14-day daily chart;
- top pages;
- contact-message count;
- recent contact messages with direct reply links;
- draft and published content counts.

The public privacy explanation is at `/privacy`.

## SEO system

Technical SEO is implemented in code, but ranking is not automatic. Search visibility grows through accurate positioning, useful original content, credible references and links, consistent publishing, and time.

### Implemented automatically

- Server-rendered and statically generated public pages
- Unique page titles and descriptions
- Canonical URLs
- Open Graph and Twitter metadata
- Dynamic social preview image
- Semantic page hierarchy with one primary `h1`
- Person and WebSite JSON-LD
- Project `SoftwareSourceCode` JSON-LD
- Article `BlogPosting` and `TechArticle` JSON-LD
- Dynamic `sitemap.xml`
- Search-safe `robots.txt`
- RSS feed
- Descriptive internal links
- Accessible image alt text
- Responsive design
- `noindex` protection for the admin area

### Required production steps

1. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain with no trailing path.
2. If possible, use a stable custom domain instead of changing the domain later.
3. Add the domain property to Google Search Console.
4. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to the verification token.
5. Deploy again.
6. Submit `https://your-domain.com/sitemap.xml` in Search Console.
7. Request indexing for the homepage, About, Projects, Blog, and strongest project pages.
8. Add your portfolio URL to GitHub, LinkedIn, your CV, speaker profiles, and professional biographies.
9. Publish original articles that answer specific engineering questions.
10. Link relevant articles to relevant project case studies and vice versa.
11. Review Search Console queries monthly and improve pages that receive impressions but few clicks.

### Content checklist for ranking your name and role

- Use “Cobbina Emmanuel” naturally in the page title, biography, author byline, and professional profiles.
- Keep “Software & Cloud Engineer” consistent across the site, LinkedIn, GitHub, and CV.
- Write specific titles such as “Designing an Offline-First ITSM Client” rather than “My New Post.”
- Give each article one clear search intent.
- Use one descriptive `h1`, meaningful `h2` sections, and a direct opening answer.
- Support claims with evidence, repositories, diagrams, measurements, or references.
- Update older posts when implementation details change.
- Avoid duplicated, thin, or automatically generated content.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Keep the detected framework as **Next.js**.
4. Add every required environment variable from `.env.example`.
5. Deploy.
6. Open the production site and test public routes.
7. Test `/admin` sign-in.
8. Publish a small draft, then a temporary test post.
9. Verify that `/sitemap.xml`, `/robots.txt`, `/feed.xml`, and `/opengraph-image` return successfully.
10. Delete or unpublish the test post.

When a custom domain is connected, update `NEXT_PUBLIC_SITE_URL` and redeploy so canonical URLs and structured data use the new domain.

## Directory map

```text
src/
  app/
    (site)/                 Public pages and shared public layout
      about/
      blog/
      contact/
      insights/
      projects/
      privacy/
    admin/                  Private publishing and analytics interface
    api/
      admin/                Authenticated content and analytics endpoints
      analytics/            Public page-view intake
      contact/              Contact-message intake and email fallback
    feed.xml/               RSS route
    layout.tsx              Global metadata and structured identity data
    manifest.ts             Web manifest
    opengraph-image.tsx     Dynamic social image
    robots.ts               Crawler policy
    sitemap.ts              Dynamic sitemap
  components/
    admin/                  Admin interface components
    site/                   Navigation, cards, forms, article and skill UI
  content/
    articles.ts             Source-controlled starter writing
    profile.ts              Experience, certifications, and skills
    projects.ts             Structured project case studies
    types.ts                Content models
  lib/
    admin-auth.ts           Signed admin session
    content.ts              Static and Supabase content loader
    site.ts                 Identity and canonical site configuration
    supabase.ts             Public and service-role clients
    validation.ts           Server input normalisation and validation
public/
  images/profile.jpeg       Profile photograph
  resume/                   Downloadable CV
supabase/
  schema.sql                Database and RLS setup
```

## Security notes

- Keep `.env.local` out of Git.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code.
- Use different values for `ADMIN_SESSION_SECRET` and `ANALYTICS_SALT`.
- Use a long unique admin password.
- Rotate secrets immediately if they appear in a commit, screenshot, issue, or log.
- Keep Supabase Row Level Security enabled.
- Review project screenshots before publishing.
- The admin session is HTTP-only, same-site strict, signed, and expires after eight hours.

## Final publishing checklist

- [ ] Current profile and role are accurate.
- [ ] CV has been replaced with the latest public version.
- [ ] Every project links to the correct public repository.
- [ ] Claims are supported by the source project or documented evidence.
- [ ] Architecture visuals contain no private information.
- [ ] Blog or insight is proofread and has a stable slug.
- [ ] SEO title and description are clear and not duplicated.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Mobile navigation and contact form are tested.
- [ ] Sitemap is submitted after deployment.

## Commerce foundation (Phase 3)

Paid resources use server-side Paystack initialization and webhook confirmation. The browser never receives `PAYMENT_SECRET_KEY`, `PAYMENT_WEBHOOK_SECRET`, or a resource `file_url`.

### Database migration

After `supabase/002_business_platform.sql`, run:

```text
supabase/003_commerce_foundation.sql
```

This migration makes payment references unique, adds an atomic download-count function for the service role, and removes anon/authenticated SELECT access to the private `resources.file_url` column.

### Payment environment variables

Add these server-side variables locally and in Vercel:

```dotenv
PAYMENT_SECRET_KEY=
PAYMENT_PUBLIC_KEY=
PAYMENT_WEBHOOK_SECRET=
```

The current provider adapter is Paystack. Checkout initialization happens only on the server. `PAYMENT_PUBLIC_KEY` is kept as provider configuration for future client-side provider features and is not exposed by the current implementation.

For Paystack, configure the payment webhook endpoint as:

```text
https://cobbinaemmanuel.tech/api/webhooks/payment
```

Set `PAYMENT_WEBHOOK_SECRET` to the secret used to validate Paystack webhook HMAC signatures (for Paystack this is normally the Paystack secret key). The webhook is authoritative: returning from the payment page does not mark an order as paid.

### Commerce routes

| Route | Purpose |
| --- | --- |
| `/resources/[slug]` | Public free/paid resource detail and checkout page |
| `/api/checkout` | Creates a pending order and initializes Paystack |
| `/api/webhooks/payment` | Verifies payment webhook and issues a 48-hour download token |
| `/order/complete` | Payment-provider return page that waits for webhook confirmation |
| `/order/[token]` | Confirmed purchase page |
| `/api/download/[token]` | Paid file proxy with paid/expiry checks |
| `/api/download/free/[slug]` | Free file proxy when no external URL is configured |
| `/api/admin/orders` | Admin-authenticated read-only order list |

Paid files are streamed through the application instead of redirecting to the stored `file_url`, so the private file location is not disclosed to the purchaser.

## SEO & analytics (Phase 4)

Phase 4 extends the existing SEO and privacy-friendly analytics systems without replacing them.

### Database migration

After `supabase/003_commerce_foundation.sql`, run:

```text
supabase/004_seo_analytics.sql
```

The migration keeps every existing analytics row as a `page_view` and adds fields for named conversion events and small non-sensitive metadata. Do not store customer names, email addresses, payment references, secrets, or resource file URLs in analytics metadata.

### Structured data

- Service detail pages emit `schema.org/Service` JSON-LD and reference the site's existing `Person` entity as the provider.
- Resource detail pages emit `schema.org/Product` JSON-LD with a server-rendered `Offer` using the resource's configured price and currency.
- Published resource detail pages are included in the dynamic sitemap.

### RSS

`/feed.xml` now includes published:

- blog posts
- insights
- services
- free resources
- paid digital products

### Conversion events

The existing `site_events` table now distinguishes normal traffic from funnel actions:

| Event | Meaning |
| --- | --- |
| `page_view` | Existing privacy-friendly page view |
| `service_view` | A service detail page was viewed |
| `cta_click` | A tracked Work With Me/service/free-resource CTA was clicked |
| `checkout_initiated` | A paid-resource checkout was successfully initialized before redirecting to Paystack |

The Analytics tab keeps page-view totals separate and shows 30-day service views, CTA clicks, checkout starts, and recent conversion activity.

## Phase 5 verification

Phase 5 security, responsive, and accessibility regression coverage is documented in [`docs/PHASE5_TESTING.md`](docs/PHASE5_TESTING.md).

Useful commands:

```bash
npm run test:security
npm run typecheck
npm run lint
npm run build
npm run verify:production
```

`npm run verify:production` expects the full production environment to be loaded and validates it before the final build.
