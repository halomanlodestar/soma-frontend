# Soma product audit & frontend runway

## Purpose

Soma is a curated, human-first social home for art and craft. It should favor
care, context, attribution, and moderation over engagement volume. This
document records the product gaps found in the web client and separates work
that can proceed now from work that must wait for a backend contract.

## Completed frontend work

- [x] Public trust pages: How It Works, Guidelines, Content Policy,
  Accessibility, Contact, and Support.
- [x] Shared information-page layout and public-site footer.
- [x] SEO foundation: site metadata helper, canonical URLs, default social
  image, JSON-LD, manifest, static sitemap, robots policy, and `noindex`
  metadata for authentication and currently private routes.
- [x] Share URLs now use the actual
  `/s/[somaSlug]/posts/[postId]` route.

## Current baseline

- Implemented public routes: home, Explore, creator profile, Soma profile, and
  post detail.
- Implemented signed-in routes: create post, create community, and settings.
- The GraphQL schema includes posts, media upload intents, comments, voting,
  follow operations, awards, notifications, profiles, and Somas.
- Several UI flows are currently presentational only: create post/community,
  settings, profile following, community joining, comment replies, saved work,
  and notifications.
- `codegen.ts` points to a server schema outside this client while the checked
  in `schema.graphql` differs from the generated client. Make the GraphQL
  contract a single source of truth before wiring more features.

## First product decisions to lock

1. A visitor may browse; only an approved creator may publish; moderators and
   admins have explicitly different permissions.
2. Community creation is an approved stewardship role, not a broadly available
   signed-in action.
3. “Human-first” is a clear disclosure, provenance, and review policy—not a
   promise that an automated detector can prove whether art is human-made.
4. Public metrics are restrained. Creator analytics remain private; no launch
   leaderboards, streaks, or metric-first feeds.
5. Direct messages are deferred until the moderation, safety, and privacy cost
   is justified.

## Product pages and routes

### Launch-critical

- `/apply` — creatorship application: discipline, portfolio, statement,
  process evidence, and policy agreement.
- `/apply/status` — submitted, in review, needs information, accepted, or
  declined.
- `/how-it-works` — what Soma is, why curation exists, and creator review.
- `/guidelines` — community guidelines and creator code of conduct.
- `/content-policy` — originality, AI-use disclosure, attribution, sensitive
  content, harassment, and minors.
- `/copyright` — copyright/DMCA and counter-notice process.
- `/privacy`, `/terms`, `/cookies`, `/accessibility`, `/contact`.
- `/report` (or a modal reached from a post/profile) and `/support`.
- `/notifications`.
- `/search` — server-backed results for work, creators, communities, and tags.
- `not-found`, `error`, and offline/retry route states.

### Creator

- `/studio` — drafts, submitted work, published work, review feedback, and
  private basic analytics.
- `/create/[postId]/edit` — edit, delete/archive, and resubmit work.
- `/collections` — private saved works and optional shareable collections.
- `/u/[username]/followers` and `/u/[username]/following`.
- A profile-editing flow for avatar, cover, links, disciplines, and bio.

### Community, moderation, and administration

- `/s` — community directory/categories.
- Community about/rules, moderators, tags, and featured work.
- `/moderation` — review queue, reports, reviewer note, and audit history.
- `/appeals/[id]` — appeal a content or application decision.
- `/admin` — application review, role assignment, community approval, and
  moderation audit log.

### Valuable later

- Following feed.
- Editorial collections/exhibitions.
- Weekly digest.
- Collaboration credits.
- Portfolio view distinct from the chronological post feed.
- Press kit, careers, public status page, and changelog.

## Existing GraphQL operations to integrate

- `createUploadIntent` + `createPost`: replace the local-preview-only publish
  path.
- `createSoma`: integrate only after server-side role authorization exists.
- `updateMyProfile`: replace static settings defaults and mock save.
- `follow`, `unfollow`, `getFollowStatus`, `getFollowers`, `getFollowing`:
  replace local follow animation state and make follower counts reliable.
- `createComment`, `replyToComment`, `updateComment`, `deleteComment`: add a
  composer and working reply/edit/delete controls.
- `getNotifications` + `markNotificationAsRead`: build the notification center.
- `createAward`, `getAwardsByPost`, `getAwardsByComment`: replace string-only
  award presentation with actual award objects.
- `getSomaFeed`: use it instead of downloading and filtering the global feed
  on the community page.
- `getTopPosts`: use for editorial/trending discovery.
- `getMediaByPost`: support galleries instead of one `mediaUrl`.
- `updatePost`, `deletePost`, and `updateSoma`: support creator/community
  management.

## Backend APIs and data to add

### Core

- Cursor connections (`items`, `pageInfo`, `totalCount`) for every feed/list.
- Full-text search, autocomplete, and typed results across works, creators,
  communities, and tags.
- Saved posts and collections.
- Community membership, roles, eligibility, and join/leave state.
- Global, following, recommended, community, and editorial feed variants.
- Notification preferences, unread count, batch actions, and SSE/subscriptions.
- Block/mute/hide controls.
- Robust media metadata: dimensions, derivatives, captions, alt text, order,
  duration, transcript, and upload status.

### Trust and moderation

- Creatorship application/review/decision/appeal lifecycle.
- Backend-enforced role and permission checks.
- Work status: draft, submitted, approved, published, needs changes, rejected,
  removed, archived.
- AI-assisted/human-made disclosure, process/provenance, collaborators,
  attribution, licensing, and rights-holder fields.
- Content/user reports, reporter privacy, moderation queue, decision reasons,
  audit log, appeal, content warnings, and copyright claims.

### Private analytics

- Creator: unique views, saves, shares, follows attributable to a work,
  referrals, watch/read time, completion, and returning viewers.
- Community: posting health, active members, moderation turnaround, report
  volume, and zero-result searches.
- Platform: application funnel, review time, meaningful retention, and failed
  upload/publish rates.

## UI components to make data-aware

- **Post cards/detail:** multi-media galleries, captions/alt text, awards,
  save/follow state, credits, rights, content warnings, and real share URLs.
- **Soma header:** actual member state, moderators, tags, policies, creator
  eligibility, and data-driven creation date.
- **User header:** persisted follow status/counts, disciplines, links,
  community roles, and verification explanation. Defer the Message button.
- **Comment tree:** composer, reply/edit/delete/report, collapse deep threads,
  and pagination.
- **Explore:** URL-backed search and filters, server search, and real For You
  states.
- **Home/Soma feeds:** cursor pagination, correct scoped feed queries, and
  reliable empty/error states.
- **Header:** notifications, settings, creator-only Studio link, and a viewer
  CTA that says Apply for Creatorship rather than Share Work.

## Frontend-only runway

These can ship without waiting for API implementation. Keep them composed from
the project’s existing shadcn primitives and Soma’s semantic design tokens.

### Ship now: public static pages

- Build `/how-it-works`, `/guidelines`, `/content-policy`, `/copyright`,
  `/privacy`, `/terms`, `/cookies`, `/accessibility`, `/contact`, `/support`,
  `/press`, and `/careers` as static routes.
- Build the visual shell for `/apply`, `/apply/status`, `/studio`, `/s`,
  `/notifications`, and `/moderation` with explicitly labelled placeholder
  states. Do not fake success or persist user-entered data.
- Add a proper footer with legal, policy, support, and social links.
- Add 404, error, loading, and empty state components for all major routes.
- Add a static human-first/AI-use policy explainer and a verification-rubric
  page.

### Ship now: SEO and discovery foundation

- Add `metadataBase` from `NEXT_PUBLIC_SITE_URL`.
- Add route-level metadata for all static pages.
- Add default Open Graph/Twitter metadata and a branded default OG image.
- Add `robots.ts`, `sitemap.ts`, web manifest, canonical URL helper, and
  `noindex` metadata for login, callback, settings, create, and future private
  routes.
- Add `Organization` and `WebSite` JSON-LD to the public shell.
- Add a reusable metadata helper so dynamic work, creator, and Soma metadata
  can plug into it once server-rendered data exists.
- Correct the share URL construction to match `/s/[somaSlug]/posts/[postId]`.

### Ship now: navigation, system UX, and accessibility

- Add header/footer information architecture, navigation states, skip link,
  mobile safe-area handling, and an account menu shell.
- Add a `/search` route with a polished no-query and no-results state; hold the
  actual search call until its API exists.
- Make Explore tab/filter/query state URL-backed now.
- Add labelled, accessible skeleton, empty, error, and permission states.
- Fix icon-only button labels, labels for search/file inputs, form `name` and
  `autocomplete` attributes, `aria-live` feedback, and focus-first-error
  behavior.
- Replace browser `alert()` and mock console output with consistent non-data
  UI feedback where appropriate.
- Establish a responsive/a11y visual test checklist at 375px, 768px, 1024px,
  and desktop in light, dark, and reduced-motion modes.

### Ship now: reusable building blocks

- `PageHero`, `LegalPageLayout`, `PolicyTableOfContents`, `EmptyState`,
  `ErrorState`, `PermissionState`, `AuthRequiredState`, `SectionHeading`,
  `ProfileLinkList`, `Stat`, `ContentWarning`, `ReportEntryPoint`, and a
  `ShareUrl` helper.
- Post/gallery presentation that accepts local typed props; do not wire a fake
  data source. This gives the later media API a stable UI target.
- Creator application and settings form layouts with validation; submit should
  clearly say unavailable until their mutations exist.
- Studio/moderation table/card layouts using fixture data isolated under a
  development-only story/fixture module.

### Ship now: engineering hardening

- Add route error boundaries and not-found routes.
- Add security headers that do not depend on backend behavior: CSP baseline,
  `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy`, and
  clickjacking protection after verifying embedded content needs.
- Add a GraphQL contract check script/CI job that runs codegen from the agreed
  schema source and fails on generated diffs.
- Remove or document the unused React Query feed hook; use Apollo for GraphQL
  and reserve React Query for REST-only endpoints.
- Add component/unit tests for pure helpers and Playwright visual/navigation
  tests for static routes.

### Ship now: AI crawler policy expression

- Add a deliberate `robots.ts` policy that allows conventional search engines
  and blocks chosen AI training crawlers (for example GPTBot, ClaudeBot,
  CCBot, and Bytespider).
- Add a public AI-use/crawler policy page and rights/contact route.
- Apply `noindex`/`X-Robots-Tag` policy to private route classes and any future
  original-resolution media delivery.
- Record the decision separately for AI search crawlers such as OAI-SearchBot
  and Claude-SearchBot; this is a discovery-policy choice, not an engineering
  default.

`robots.txt` communicates a preference; CDN/WAF enforcement, verified-bot
matching, rate limiting, and media access controls require deployment/backend
infrastructure and should follow later.

## Do not build against mocks as if they are real

- Do not make create-post, follow, join-Soma, save, comments, notifications,
  or moderation actions appear to persist before their APIs do.
- Do not permanently choose a post/media shape until the backend finalizes the
  gallery, caption, alt-text, provenance, and review-status contract.
- Do not expose community creation to every signed-in user in the final UI.
- Do not build a real DM inbox before a safety and moderation plan exists.

## Recommended frontend sequence while backend is in progress

1. SEO/crawler routes, metadata helper, footer, security headers, route
   loading/error/not-found states.
2. Legal/trust/support/static education pages.
3. Accessibility sweep and shared state/form components.
4. Search, Studio, creator application, notification, and moderation page
   shells with isolated fixtures.
5. Gallery/work-detail presentation and profile/community management shells.
6. Contract cleanup and integration feature-by-feature as backend mutations and
   queries arrive.
