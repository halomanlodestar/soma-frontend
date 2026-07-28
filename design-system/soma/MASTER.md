<!-- @format -->

# Soma — Design & Philosophy

> This is Soma's source of truth for future UI work. Page-specific guidance may live in `design-system/soma/pages/`, but it must extend this document rather than contradict it.

## 1. The product idea

Soma is a safe haven for art and quality in a feed culture crowded by mass-produced, low-intention content. It does not position AI itself as the enemy: the distinction is human intention, craft, and care.

Soma is for two equally important people:

- **Creators** — artists, photographers, music producers, video editors, engineers, and anyone whose work deserves room to be seen rather than buried by volume.
- **Viewers** — curious visitors, regular followers, and people who want to spend time with work that has substance.

The experience should feel like coming home to a quieter corner of the internet: warm, considered, slower, and human. It should invite lingering—not compel endless consumption.

### Design consequences

- Prioritize quality, context, and individual works over volume, novelty, or metrics.
- Let content breathe. Empty space is part of the product, not wasted inventory.
- Favor calm editorial composition over the visual density of conventional social feeds.
- A community (“Soma”) provides Reddit-like classification and discovery, but never turns the interface into a noisy forum dashboard.
- Use motion to orient, confirm, and gently delight—never to demand attention.

## 2. Visual character

**Keywords:** warm editorial, quiet confidence, human craft, cozy, restrained, tactile, deliberate.

Soma is neither a cold tech product nor a nostalgic “funky” art site. It has a modern, legible foundation with a literary display face and an earthy palette. The visual system should feel composed enough for serious work, while remaining comfortable enough to stay awhile.

Avoid:

- Generic SaaS/dashboard density.
- Loud gradients, glassmorphism, neon, or decorative noise.
- Excessive rounded cards, floating panels, and shadows.
- Gamified urgency, metric-first layouts, or attention-harvesting animation.
- Treating every piece of text as simultaneously large **and** bold.

## 3. Color system

Use semantic tokens from `src/app/globals.css`; do not introduce raw hex values in component code.

### Light theme

| Token | Value | Purpose |
| --- | --- | --- |
| `--background` | `#faf8f2` | Warm paper-like page ground |
| `--foreground` | `#26342e` | Primary reading color |
| `--card` | `#ffffff` | Rare elevated surface |
| `--primary` | `#28473e` | Deep botanical green: action and emphasis |
| `--secondary` | `#edf0e8` | Quiet supporting surface |
| `--accent` | `#e2eee6` | Soft green highlight |
| `--muted` | `#f0eee6` | Recessed surface |
| `--muted-foreground` | `#68716b` | Supporting text |
| `--border` | `#deded4` | Gentle structural separation |
| `--button-accent` | `#D4A373` | Coffee fill on primary-button hover |

### Dark theme

| Token | Value | Purpose |
| --- | --- | --- |
| `--background` | `#0A0908` | Near-black warm ground |
| `--foreground` | `#F5EBE0` | Warm readable text |
| `--primary` | `#D4A373` | Mocha/coffee: principal active surface |
| `--secondary` | `#1C1816` | Quiet dark supporting surface |
| `--accent` | `#1C1816` | Supporting surface |
| `--border` | `#1C1816` | Structural separation |
| `--button-accent` | `#557765` | Muted green fill on primary-button hover |

### Color rules

- The palette is intentionally small: warm paper/ink, deep green, and coffee are enough.
- Green and coffee are complementary partners. Their roles invert across themes so neither disappears.
- Do not reintroduce pale peach (`#f5ebe1`) as a new surface token. It diluted the green accent and made the palette needlessly larger.
- Use `bg-primary`, `text-primary`, `bg-secondary`, `border-border`, etc. Never hardcode palette values in components.
- Borders are for structure, not decoration. Keep them low-contrast and purposeful.

## 4. Typography

### Families

- **Interface and reading:** Inter (`--font-sans`)
- **Display/editorial:** Lora (`--font-heading`)

Inter keeps the product clear and contemporary without the techy feel of Manrope. Lora introduces an artistic, human note without becoming theatrical.

### Hierarchy principle

Use **size or weight** as the dominant signal at a given level—usually not both. Oversized bold text feels forceful and competes with the art.

| Role | Family | Typical treatment |
| --- | --- | --- |
| Page/section heading | Lora | Larger size, `font-medium`, tight negative tracking |
| Post title | Inter | `text-lg`–`text-xl`, `font-medium`; not oversized |
| Body and descriptions | Inter | `text-sm`, relaxed leading, regular weight |
| Metadata | Inter | `text-xs`/`text-sm`, muted color, regular weight |
| Eyebrow/label | Inter | `text-xs`, medium weight, optional restrained uppercase tracking |

### Text rules

- Default body text should remain comfortable at 14–16px with generous line-height.
- Use `font-medium` sparingly for titles, navigation state, and decisive actions. Reserve heavier weights for rare emphasis.
- Let color and spacing establish metadata hierarchy before reaching for smaller sizes or bold.
- Preserve a visible gap between author/community metadata and a post title. The title should read as its own thought, not as a continuation of the author line.
- Use `text-muted-foreground` for genuinely secondary information, never for copy that must be read to understand an action.

## 5. Layout, spacing, and surfaces

Soma is spacious but not empty. It uses rhythm rather than boxes to organize content.

### Spacing rhythm

- Use Tailwind's 4px rhythm.
- Standard component gaps: 8–16px.
- Content groups: 20–24px.
- Section separation: 32–56px depending on context.
- Page hero/intro areas can use 40–56px vertical padding.
- Align major content to shared container edges (`max-w-7xl` for broad exploration; narrower columns for reading feeds).

### Surface hierarchy

1. **Page ground** — `bg-background`, usually uninterrupted.
2. **Structural separation** — a single `border-border` divider.
3. **Supporting surface** — `bg-secondary` or `bg-muted` for controls and quiet zones.
4. **Elevated surface** — `bg-card`, used only where an object needs containment or interaction clarity.

### The card rule

Cards are a tool, not the default layout language.

- **Feeds and reading:** do not wrap every post in a card. Use a continuous column with generous vertical padding and dividers. This feels editorial and reduces visual fatigue.
- **Community discovery:** a card is appropriate because each community is a distinct destination. Keep its shell quiet: one border, restrained hover lift/shadow, and a footer that has its own bottom padding.
- **Controls and temporary states:** prefer simple surfaces, separators, and whitespace to nested cards.
- Avoid card-inside-card layouts unless there is a clear hierarchy boundary.

## 6. Components and interaction patterns

### Header

The header is compact, clear, and not visually louder than the page content.

- Navigation uses a shared, measured underline that slides from link to link.
- Measure the active link; do not fake the position with fixed offsets.
- Motion: `350ms`, `cubic-bezier(0.22, 1, 0.36, 1)`, with reduced-motion disabled.
- The active indicator communicates location; it should not bounce or over-animate.

### Buttons

Buttons are comfortably sized, not shadcn-default-small.

- Default height: **40px**; large: **44px**; small: **32px**.
- Maintain enough horizontal padding for calm, touchable controls.
- Button labels use Inter and medium weight—clear but never shouty.
- Primary, secondary, and outline actions should have a visible response on hover.

#### Fill interaction

On hover, a color fill grows from the **bottom-left** across the button.

- In light mode, a green primary button fills with coffee (`--button-accent`).
- In dark mode, a coffee primary button fills with muted green (`--button-accent`).
- Secondary/outline buttons fill with `primary` and switch their text to `primary-foreground`.
- Use a 300ms transition and respect `prefers-reduced-motion`.
- The fill is an interaction cue, not a gradient effect. Keep it flat and restrained.

### Tabs: standard pill variant

Use `TabsList variant="pill"` for a compact set of peer views (such as Explore's Communities / Work / For You).

```tsx
<Tabs defaultValue="communities">
  <TabsList variant="pill">
    <TabsTrigger value="communities">Communities</TabsTrigger>
    <TabsTrigger value="work">Work</TabsTrigger>
  </TabsList>
</Tabs>
```

This variant is intentionally distinctive:

- An outlined track remains visible.
- The active trigger retains its own border: it is the **vessel**.
- A `bg-primary` thumb moves beneath that bordered trigger, making it appear to fill with coffee/green as it glides.
- The thumb measures the active trigger, so labels of different widths still align perfectly.
- Use the same 350ms spring-like cubic-bezier as header navigation, with reduced-motion fallback.

Do not replace this with an instantaneous selected-state pill, a black thumb, or an undersized thumb floating in excessive track padding.

### Inputs and search

- Inputs are calm, light-bordered, and at least 44px for primary search/control contexts.
- Search can be prominent at the top of Explore, but should not feel like a command centre.
- Visible focus treatment must remain clear without changing the visual language.

### Icons

- Use the project's Lucide icon set consistently.
- Icons support an action or idea; they do not substitute for labels where clarity matters.
- Avoid emoji as interface icons.

## 7. Page patterns

### Home

- Lead with an editorial invitation: quiet, human, and specific—not growth-hack copy.
- A creator spotlight may use a primary surface because it is a genuine featured object.
- The main feed is a continuous reading column; posts are separated by dividers, not a stack of floating cards.

### Explore

- Start with a calm introductory block and search.
- Use the standard animated pill tabs.
- Communities appear as a clear discovery grid of restrained cards.
- Work appears in a narrower, uncarded editorial feed.
- “For You” should be a quiet, honest empty/early-state rather than an algorithmic spectacle.

## 8. Motion rules

Motion should make the interface feel alive but unhurried.

- Prefer 200–350ms microinteractions.
- Use spatial continuity: indicators move to their next location instead of teleporting.
- Use `cubic-bezier(0.22, 1, 0.36, 1)` for the signature navigation/tab movement.
- A confirmed social action may earn one compact acknowledgement: Follow expands briefly and plays bell → creator craft → check, with each 360ms icon popping, tilting, and contracting before the next. Use Paintbrush as the temporary craft icon until creator-Soma data is available. Adding an upvote uses a 360ms arrow/count pop. Never repeat these on hover or removal.
- Avoid page-wide entrance choreography, looping decoration, aggressive scale, and bounce.
- Do not animate layout in ways that move surrounding content.
- Every nonessential animation must be disabled by `motion-reduce`.

## 9. Accessibility and quality bar

- Keep keyboard focus visible; do not remove focus treatment to make the UI “cleaner.”
- Maintain readable contrast in both light and dark themes.
- All interactive states need a non-hover signal: focus, active, selected, or disabled.
- Preserve touch-friendly targets, especially for buttons and tabs.
- Respect reduced motion.
- Test at 375px, 768px, 1024px, and wide desktop widths. No horizontal overflow.
- Avoid layout shifts from media or async content; reserve space with appropriate skeletons.

## 10. Implementation checklist

Before shipping a new Soma interface, ask:

- Does it make art and reading feel calmer, clearer, or more considered?
- Is a card genuinely needed, or would whitespace and a divider say more?
- Is hierarchy driven by one strong signal rather than size **and** weight at once?
- Are green and coffee being used as a relationship, not as extra decoration?
- Does the component use existing semantic tokens and shared primitives?
- Is motion purposeful, spatially continuous, and reduced-motion safe?
- Does the dark theme still preserve the intended contrast and detail?

If the answer to any is no, simplify before adding more.
