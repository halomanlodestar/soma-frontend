<!-- @format -->

Soma UI Philosophy (v1)

1. Core Principle

Soma is a reading-first, content-respecting platform.

The UI must:

prioritize content over controls

avoid visual noise

avoid dense dashboards

feel calm, intentional, and editorial

If a UI decision increases stimulation but reduces clarity, do not do it.

2. Reddit-like Structural Model (Important)

All primary pages must follow this structure:

[Page Container]
├── Main Content Column (primary)
└── Context Column (secondary, optional)

Rules:

Main column contains the content being consumed

Secondary column contains metadata, actions, or context

Never mix core content and metadata into the same visual block

Never center everything; use vertical flow

3. Feed Page Structure

Each feed item must be structured as:

[Post Card]
├── Metadata Row
│ - Soma name
│ - Author name
│ - Timestamp
├── Title (dominant)
├── Media Preview (if exists)
└── Interaction Row - Vote count - Award count

Rules:

Title must visually dominate metadata

Media must not push metadata off-screen

Interaction controls must be visually quiet

No action buttons near the title

4. Post Detail Page Structure

Post detail pages must follow this hierarchy:

[Post Header]

- Title
- Author
- Soma
- Timestamp

[Post Body]

- Text content
- Media (full resolution)

[Post Signals]

- Votes
- Awards

[Comments Section]

- Comments are vertically stacked
- Indentation communicates hierarchy

Rules:

Header is compact

Body is distraction-free

Signals are visually separated from content

Comments never compete with the post

5. Media Presentation Rules (Critical)

Media must:

be centered

have minimal UI chrome

never be surrounded by decorative elements

never be placed inside colored cards

Media containers must feel neutral, like a gallery wall.

6. Controls & Interactions

Controls must:

be subtle

be visually secondary to content

avoid bright colors unless state-changing

avoid grouping too many actions together

Voting and awarding must feel like signals, not buttons.

7. Typography & Spacing

Rules:

Vertical spacing > horizontal density

Text should breathe

Do not compress paragraphs

Avoid large blocks of UI chrome

Whitespace is a feature, not wasted space.

8. What NOT to Do (Hard Rules)

Do NOT:

create dashboards

show multiple cards inside cards

place buttons inline with content text

mix metadata into body text

over-style components

invent UI widgets

If unsure, default to simplicity.

9. Component Design Rules

Components must be:

single-purpose

composable

shallow (no deep nesting)

reusable only if reused at least twice

Pages assemble components; components do not fetch data.

10. Priority Order (Always Follow)

Content

Readability

Structure

Interaction

Styling

Never invert this order.
