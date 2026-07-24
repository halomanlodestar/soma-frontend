<!-- @format -->

# Core Principles & AI Rules

1. **Shadcn First**: DO NOT CREATE A COMPONENT IF IT IS AVAILABLE IN SHADCN. Just install the components using the CLI.
2. **Strict Typing & Placement**: Always use proper TypeScript typing. Avoid using `any`. **CRITICAL**: Do NOT define types or interfaces inside API files, hooks, or components. Extract all types into their respective module's `types/` folder (e.g., `src/modules/auth/types/`) or the global `src/types/` folder.
3. **Placeholder Data**: If you ever need placeholder data before APIs are ready, make a custom hook for it (e.g., `useFeed()`) and keep the mock data there. Never clutter UI components with raw data structures.
4. **Coupling**: If a component gets too big, break it into smaller ones ONLY IF it follows fundamental engineering coupling rules.

---

## Architecture: The 3-Layer "Module + Shared" Pattern

Soma follows a strict separation of concerns mapped to traditional software layers. Code is organized into `src/modules/` (domain-specific) and `src/components/` or `src/lib/` (global/shared).

### 1. Presentation Layer (UI)

- **Role**: Pure, "dumb" components. They accept props and render JSX. No data fetching, no complex state management.
- **Location**:
  - Global/Shared UI: `src/components/ui/` (Shadcn primitives) and `src/components/common/` (e.g. `PostCard`, `UserAvatar`).
  - Module UI: `src/modules/[name]/components/`.

### 2. Business Logic Layer (State & Rules)

- **Role**: The "glue". Holds state, handles user interactions, runs validations (Zod), and orchestrates data fetching. UI components consume these hooks.
- **Location**:
  - Global: `src/hooks/` and `src/store/` (Zustand).
  - Module Logic: `src/modules/[name]/hooks/`.
- **Rule of Thumb**: If a UI component has more than 2-3 `useState` or `useEffect` calls, that logic MUST be extracted into a custom hook.

### 3. Data Layer (Network & Caching)

- **Role**: Communicates with the backend, manages cache, and transforms payloads.
- **Location**:
  - Global: `src/lib/api/` (Axios instances, Orval generated clients).
  - Module Data: `src/modules/[name]/api/` (React Query hooks like `useGetPosts`).
- **Rule of Thumb**: Components must NEVER make raw `fetch` or `axios` calls directly. All data fetching/mutating must be encapsulated inside React Query custom hooks.

---

## Next.js App Router Rules (`src/app/`)

- Files inside `src/app/` (like `page.tsx` and `layout.tsx`) act strictly as **orchestrators**.
- **Rule of Thumb**: A `page.tsx` should only read URL parameters, fetch initial server-side data if needed, and assemble components from the layers above. Never write complex business logic or massive UI trees directly inside a page route.

## Dependency Rules (Preventing Spaghetti Code)

- **The Golden Rule**: If a piece of code (UI, logic, or data) inside `modules/user` is needed by `modules/post`, it DOES NOT belong in either. It must be extracted into `src/components/common/` or `src/lib/`.
- **One-Way Flow**: Presentation depends on Business. Business depends on Data. Do not invert this flow.
