<!-- @format -->

# Soma - Web Application Pages & Architecture Specification

> **Context**: Soma is a human-first, quality-over-quantity social platform designed as a safe haven from low-effort AI slop. Built on a Reddit-like structural model, content creation is restricted to verified human creators, while communities are organized as **Somas**.

---

## 📐 General Page Layout Model

In accordance with [`design-philosphy.md`](file:///D:/code/soma/web/docs/design-philosphy.md), all primary pages follow a 2-column editorial structure:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              Global Header                             │
├──────────────────────────────────────────┬─────────────────────────────┤
│                                          │                             │
│           Main Content Column            │       Context Column        │
│          (Primary Content Flow)          │     (Metadata & Actions)    │
│                                          │                             │
└──────────────────────────────────────────┴─────────────────────────────┘
```

---

## 🗂️ Complete Route Hierarchy

```
├── /                               (Home Feed)
├── /explore                        (Explore Somas & Categories)
├── /manifesto                      (Human-First Philosophy & Guidelines)
├── /search                         (Global Search & Filters)
├── /notifications                  (Inbox & Activity Stream)
├── /create                         (Create Post - Creator Only)
│
├── /s/[somaSlug]                   (Soma Feed)
│   ├── /about                      (Soma Rules & Information)
│   ├── /creators                   (Roster of Approved Creators)
│   └── /mod                        (Soma-specific Moderation Panel)
│
├── /s/[somaSlug]/posts/[postId]    (Post Detail & Comments)
│
├── /u/[userId]                     (User Profile - Overview & Activity)
│   ├── /posts                      (User's Authored Posts)
│   ├── /comments                   (User's Comments & Discussions)
│   ├── /upvoted                    (Liked / Upvoted Content)
│   └── /saved                      (Bookmarked Content)
│
├── /creatorship/apply              (Apply to become a Verified Creator)
│
├── /mod/queue                      (Global Mod Post Queue)
├── /mod/applications               (Global Mod Application Queue)
│
├── /login                          (User Authentication)
├── /signup                         (Account Registration)
├── /onboarding                     (Initial Interest & Soma Subscription)
│
└── /settings                       (Account & Profile Settings)
```

---

## 📄 Detailed Page Specifications

### 1. Main Feed (`/`)

- **Purpose**: Primary entry point. Displays a curated, distraction-free feed of top and recent human-verified posts.
- **Layout**:
  - **Main Column**: Feed of Post Cards (Hot / New / Top filters, media previews, vote/comment counts).
  - **Context Column**: Quick access to "Joined Somas", platform announcement, "Apply for Creatorship" CTA banner.
- **Access Level**: Public (View), Authenticated (Upvote/Save/Comment).
- **Key Features**: Infinite scroll/pagination, based on user's interest.

---

### 2. Explore Somas (`/explore`)

- **Purpose**: Discover new Somas (communities) organized by domain, topic, or craft.
- **Layout**:
  - **Main Column**: Grid or list of Soma Cards (Icon, Name, Description, Creator Count, Subscriber Count, Join/Leave button).
  - **Context Column**: Featured Somas of the Week, Trending Topics.
- **Access Level**: Public.
- **Key Features**: Search bar for Somas, category filters (Visual Art, Writing, Music, Crafting, Thought).

---

### 3. Soma Feed (`/s/[somaSlug]`)

- **Purpose**: Community homepage for a specific Soma (e.g., `s/indie-writing`).
- **Layout**:
  - **Main Column**: Soma Banner/Header, Soma post feed filtered by Hot / New / Top.
  - **Context Column**: Soma rules, moderator list, subscriber count, creator count, "Create Post" button (if user has Creatorship for this Soma).
- **Access Level**: Public.

---

### 4. Soma Information & Rules (`/s/[somaSlug]/about`)

- **Purpose**: Deep dive into community guidelines, history, and rules for a given Soma.
- **Layout**:
  - **Main Column**: Full list of rules, guidelines on acceptable human content, community mission.
  - **Context Column**: List of active moderators with message/contact triggers.
- **Access Level**: Public.

---

### 5. Soma Approved Creators (`/s/[somaSlug]/creators`)

- **Purpose**: Showcases all verified human creators authorized to publish content within this specific Soma.
- **Layout**:
  - **Main Column**: Grid of Creator Cards (Avatar, Name, Bio, Portfolio link, Recent Posts in this Soma).
  - **Context Column**: Explanation of Soma-specific Creatorship requirements.
- **Access Level**: Public.

---

### 6. Soma Moderation Panel (`/s/[somaSlug]/mod`)

- **Purpose**: Dedicated workspace for moderators of a specific Soma to manage community content.
- **Layout**:
  - **Main Column**: Pending post reviews, flagged posts, community log.
  - **Context Column**: Soma statistics, mod actions history.
- **Access Level**: Restricted (Soma Moderators & Platform Admins).

---

### 7. Post Detail (`/s/[somaSlug]/posts/[postId]`)

- **Purpose**: Distraction-free, editorial view for reading a single post and participating in discussions.
- **Layout**:
  - **Main Column**: Post Header (Title, Author, Soma, Date, Verification Badge), Post Body (Markdown text, full-res centered media), Signal Bar (Upvote count, Share, Save), Nested Comment Tree.
  - **Context Column**: Author Info Card (Bio, Portfolio link), Soma Quick Info Card, Related Posts in this Soma.
- **Access Level**: Public.
- **Key Features**: Threaded vertical comments, subtle vote/share controls, distraction-free reading mode.

---

### 8. Create Post (`/create`)

- **Purpose**: Content creation studio for verified creators.
- **Layout**:
  - **Main Column**: Soma selector dropdown, Title input, Markdown editor / Rich media uploader, "Human Effort Notes" field (optional note explaining the creation process).
  - **Context Column**: Soma Posting Guidelines checklist, Creator Code of Conduct.
- **Access Level**: Restricted (Verified Creators only).

---

### 9. User Profile & Sub-Pages (`/u/[userId]`)

- **Purpose**: Public profile for every member of the community.
- **Sub-Routes**:
  - `/u/[userId]`: Overview (Bio, Avatar, Joined Date, Badges, Activity Feed).
  - `/u/[userId]/posts`: Filtered view of posts created by this user.
  - `/u/[userId]/comments`: Filtered view of comments left by this user.
  - `/u/[userId]/upvoted`: Posts liked/upvoted by the user.
  - `/u/[userId]/saved`: Bookmarked posts (Private to account owner).
- **Layout**:
  - **Main Column**: Tabbed navigation (Overview, Posts, Comments, Upvoted, Saved), Activity Stream.
  - **Context Column**: User Bio card, Creatorship status badge, Joined Somas list.
- **Access Level**: Public (Overview/Posts/Comments), Private (Saved).

---

### 10. Apply for Creatorship (`/creatorship/apply`)

- **Purpose**: Portal for users to apply for verified creator status.
- **Layout**:
  - **Main Column**: Application Form (Category/Soma selection, Portfolio URLs, Sample uploads, Narrative on their human craft/process).
  - **Context Column**: Creatorship Expectations, Selection Criteria & Guidelines.
- **Access Level**: Authenticated Users (Non-creators or creators applying for additional Somas).

---

### 11. Global Moderation Queues (`/mod/queue` & `/mod/applications`)

- **Purpose**: Centralized moderation console for platform moderators.
- **Sub-Routes**:
  - `/mod/queue`: Queue of flagged or unverified posts needing review.
  - `/mod/applications`: Incoming creatorship applications needing review and approval/rejection.
- **Layout**:
  - **Main Column**: Application / Post Review Cards with approval/rejection triggers and feedback inputs.
  - **Context Column**: Moderation Guidelines, Recent Mod Actions Log.
- **Access Level**: Restricted (Global Moderators & Admins).

---

### 12. Global Search (`/search`)

- **Purpose**: Universal search across posts, Somas, and creators.
- **Layout**:
  - **Main Column**: Search bar, filter toggles (All, Posts, Somas, Creators), Search Result Items.
  - **Context Column**: Popular Search Tags, Recommended Somas.
- **Access Level**: Public.

---

### 13. Notifications (`/notifications`)

- **Purpose**: Central hub for user interactions and platform updates.
- **Layout**:
  - **Main Column**: Vertical list of notifications (Comment replies, Upvote milestones, Creatorship application updates, Mod notices).
  - **Context Column**: Notification preferences shortcut.
- **Access Level**: Authenticated Users.

---

### 14. Manifesto & Philosophy (`/manifesto`)

- **Purpose**: Public statement detailing the "Human First" vision of Soma.
- **Layout**:
  - **Main Column**: Editorial text article explaining why AI slop is banned, the philosophy of intentional human craft, and community values.
  - **Context Column**: Link to apply for Creatorship, Link to explore Somas.
- **Access Level**: Public.

---

### 15. Auth & Onboarding (`/login`, `/signup`, `/onboarding`)

- **`/login` & `/signup`**: Minimal, serene authentication forms.
- **`/onboarding`**: Step-by-step onboarding wizard for new users to set their bio, pick initial Somas of interest, and learn about the Creatorship model.

---

### 16. Settings (`/settings`)

- **Purpose**: Account management and personal preferences.
- **Layout**:
  - **Main Column**: Profile edit (Avatar, Bio, Links), Account Security (Email, Password), Notification Preferences.
  - **Context Column**: Danger Zone (Account deletion, Data export).
- **Access Level**: Authenticated Users.
