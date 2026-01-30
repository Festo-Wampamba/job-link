# Contributing to Kore-Standards

Thank you for your interest in contributing to **Kore-Standards**! This document provides guidelines and best practices for contributing to the project.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Environment Setup](#development-environment-setup)
4. [Git Workflow](#git-workflow)
5. [Branching Strategy](#branching-strategy)
6. [Commit Message Guidelines](#commit-message-guidelines)
7. [Pull Request Process](#pull-request-process)
8. [Coding Standards](#coding-standards)
9. [Testing Requirements](#testing-requirements)
10. [Database Changes](#database-changes)
11. [Reporting Issues](#reporting-issues)

---

## 📜 Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and professional in all interactions.

---

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** v18+ - [Download](https://nodejs.org/)
- **pnpm** - Install via `npm install -g pnpm`
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download](https://git-scm.com/)

### First-Time Setup

1. **Fork the Repository** (if external contributor):

   ```bash
   # Visit https://github.com/Festo-Wampamba/kore-standards and click "Fork"
   ```

2. **Clone Your Fork** (or main repo if team member):

   ```bash
   git clone https://github.com/YOUR_USERNAME/kore-standards.git
   cd kore-standards
   ```

3. **Add Upstream Remote** (if forked):

   ```bash
   git remote add upstream https://github.com/Festo-Wampamba/kore-standards.git
   ```

4. **Install Dependencies**:

   ```bash
   pnpm install
   ```

5. **Set Up Environment Variables**:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your local configuration:

   ```env
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=kore_standards
   DB_HOST=localhost
   DB_PORT=5432
   ```

6. **Start PostgreSQL Database**:

   ```bash
   pnpm db:up
   ```

7. **Run Database Migrations**:

   ```bash
   pnpm db:migrate
   ```

8. **Start Development Server**:

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to verify setup.

---

## 🛠️ Development Environment Setup

### Recommended Tools

- **Code Editor**: [Visual Studio Code](https://code.visualstudio.com/)
- **VS Code Extensions**:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - PostgreSQL (for database management)
  - Docker

### Project Structure Overview

```
kore-standards/
├── src/
│   ├── app/                 # Next.js App Router (pages, layouts)
│   ├── drizzle/             # Database schema and migrations
│   ├── data/env/            # Environment variable validation
│   └── components/          # Reusable React components
├── public/                  # Static assets
├── drizzle/                 # Drizzle migration files
├── .env                     # Environment variables (DO NOT COMMIT)
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

---

## 🌳 Git Workflow

### Keep Your Branch Updated

Always sync with the latest changes from `develop` before starting work:

```bash
git checkout develop
git pull origin develop
```

### Standard Workflow

1. **Create a Branch** (see [Branching Strategy](#branching-strategy))
2. **Make Changes** and commit incrementally
3. **Test Locally** (see [Testing Requirements](#testing-requirements))
4. **Push to Remote**
5. **Open a Pull Request** to `develop`
6. **Address Review Feedback**
7. **Merge** (requires at least 1 approval)

---

## 🌿 Branching Strategy

We use a **Feature Branch Workflow** with the following conventions:

### Branch Types

| Branch Type     | Prefix     | Example                     | Purpose                       |
| :-------------- | :--------- | :-------------------------- | :---------------------------- |
| **Main**        | `main`     | `main`                      | Production-ready code         |
| **Development** | `develop`  | `develop`                   | Integration branch            |
| **Feature**     | `feature/` | `feature/job-listing-page`  | New features                  |
| **Bug Fix**     | `bug/`     | `bug/fix-login-redirect`    | Bug fixes                     |
| **Chore**       | `chore/`   | `chore/update-dependencies` | Maintenance, cleanup, configs |

### Creating a New Branch

**Always branch off from `develop`**, not `main`:

```bash
# 1. Switch to develop and pull latest changes
git checkout develop
git pull origin develop

# 2. Create your feature branch
git checkout -b feature/your-feature-name

# Example:
git checkout -b feature/employer-dashboard
```

### Branch Naming Conventions

- Use **lowercase** letters
- Separate words with **hyphens** (`-`)
- Be **descriptive** but **concise**
- Include the **type prefix** (`feature/`, `bug/`, `chore/`)

**Good Examples**:

```
feature/ai-job-matching
bug/database-connection-timeout
chore/upgrade-nextjs
```

**Bad Examples**:

```
myFeature               # Missing prefix
feature/FIX             # Too vague
bug-login               # Missing slash after prefix
```

---

## 💬 Commit Message Guidelines

We follow **Conventional Commits** for clear and structured commit history.

### Format

```
<type>: <description>

[optional body]

[optional footer]
```

### Commit Types

| Type       | Description                                | Example                                 |
| :--------- | :----------------------------------------- | :-------------------------------------- |
| `feat`     | New feature                                | `feat: add employer verification flow`  |
| `fix`      | Bug fix                                    | `fix: resolve resume upload error`      |
| `docs`     | Documentation changes                      | `docs: update contributing guidelines`  |
| `style`    | Code formatting (no logic change)          | `style: format job listing component`   |
| `refactor` | Code restructuring (no feature/bug change) | `refactor: extract auth logic to hook`  |
| `test`     | Adding or updating tests                   | `test: add job application unit tests`  |
| `chore`    | Maintenance (dependencies, configs)        | `chore: update drizzle-orm to v0.45`    |
| `perf`     | Performance improvements                   | `perf: optimize database query indexes` |

### Examples

**Simple Commit**:

```bash
git commit -m "feat: add job listing filters"
```

**Detailed Commit**:

```bash
git commit -m "fix: resolve database migration conflict

- Updated job_listings schema to include missing index
- Fixed migration order in 0003_add_indexes.sql
- Verified migration runs successfully on clean database

Closes #42"
```

### Best Practices

- ✅ Use **present tense** ("add" not "added")
- ✅ Keep the first line **under 72 characters**
- ✅ Capitalize the first letter of the description
- ✅ No period (`.`) at the end of the description
- ✅ Reference issue numbers in the footer (`Closes #123`, `Fixes #456`)
- ❌ Avoid vague messages like "fixes" or "updates"

---

## 🔄 Pull Request Process

### Before Creating a PR

1. **Test Locally**:

   ```bash
   pnpm dev           # Ensure dev server runs
   pnpm lint          # Fix linting errors
   pnpm build         # Verify production build
   ```

2. **Update from `develop`**:

   ```bash
   git checkout develop
   git pull origin develop
   git checkout your-branch
   git merge develop
   # Resolve any conflicts
   ```

3. **Push Your Branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Creating the Pull Request

1. Go to the GitHub repository
2. Click **"New Pull Request"**
3. Set **base branch** to `develop` (NOT `main`)
4. Set **compare branch** to your feature branch
5. Fill out the PR template:

#### PR Title Format

Use the same format as commit messages:

```
feat: Add employer dashboard UI
fix: Resolve job listing pagination bug
chore: Upgrade Next.js to v16.1
```

#### PR Description Template

```markdown
## Description

Brief summary of what this PR does.

## Changes

- List of specific changes made
- Another change
- Yet another change

## Related Issues

Closes #123
Relates to #456

## Testing

- [ ] Tested locally on development server
- [ ] Verified database migrations run successfully
- [ ] Checked responsive design on mobile
- [ ] No console errors or warnings

## Screenshots (if applicable)

[Add screenshots for UI changes]

## Checklist

- [ ] Code follows project coding standards
- [ ] Commit messages follow conventional commits format
- [ ] Documentation updated (if applicable)
- [ ] No merge conflicts with `develop`
```

### Review Process

1. **Request Reviews**: Assign at least **1 team member** as a reviewer
2. **CI Checks**: Ensure all automated checks pass (linting, build)
3. **Address Feedback**: Respond to review comments and make requested changes
4. **Approval Required**: At least **1 approval** needed before merging
5. **Merge**: Use **"Squash and Merge"** to keep history clean

### After Merging

Delete your feature branch to keep the repository clean:

```bash
git checkout develop
git pull origin develop
git branch -d feature/your-feature-name           # Delete local branch
git push origin --delete feature/your-feature-name # Delete remote branch
```

---

## 🎨 Coding Standards

### TypeScript

- ✅ Use **TypeScript** for all new files
- ✅ Define explicit **types** and **interfaces**
- ✅ Avoid `any` type (use `unknown` if necessary)
- ✅ Use **type inference** where obvious
- ✅ Export types alongside components

**Example**:

```typescript
// ✅ Good
interface JobListingProps {
  title: string;
  wage: number;
  district: string;
}

export function JobListing({ title, wage, district }: JobListingProps) {
  // Component code
}

// ❌ Bad
export function JobListing(props: any) {
  // Missing types
}
```

### React Best Practices

- ✅ Use **functional components** with hooks
- ✅ Use **Server Components** by default (Next.js 16)
- ✅ Add `"use client"` directive only when needed
- ✅ Extract reusable logic into **custom hooks**
- ✅ Keep components **small and focused**

**Example**:

```typescript
// ✅ Good - Server Component (default)
export default function JobListingsPage() {
  return <div>Job Listings</div>;
}

// ✅ Good - Client Component (when interactivity needed)
"use client";

import { useState } from "react";

export function JobFilterForm() {
  const [district, setDistrict] = useState("");
  return <form>...</form>;
}
```

### Naming Conventions

| Type                 | Convention         | Example            |
| :------------------- | :----------------- | :----------------- |
| **Components**       | PascalCase         | `JobListing.tsx`   |
| **Hooks**            | camelCase (use...) | `useJobFilters.ts` |
| **Utilities**        | camelCase          | `formatWage.ts`    |
| **Constants**        | UPPER_SNAKE_CASE   | `MAX_WAGE_AMOUNT`  |
| **Database Tables**  | snake_case         | `job_listings`     |
| **Environment Vars** | UPPER_SNAKE_CASE   | `DB_USER`          |

### File Organization

```typescript
// Component file structure
import { ComponentType } from "react";     // External imports first
import { type JobListing } from "@/types"; // Type imports
import { formatWage } from "@/lib/utils";  // Internal imports

// Types/Interfaces
interface JobCardProps {
  job: JobListing;
}

// Component
export function JobCard({ job }: JobCardProps) {
  return (
    <div>
      <h3>{job.title}</h3>
      <p>{formatWage(job.wage)}</p>
    </div>
  );
}
```

### Styling

- ✅ Use **Tailwind CSS** utility classes
- ✅ Use `cn()` helper from `lib/utils` for conditional classes
- ✅ Keep styles **co-located** with components
- ❌ Avoid inline styles unless necessary

**Example**:

```typescript
import { cn } from "@/lib/utils";

export function Button({ variant = "primary", className, ...props }) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md font-medium",
        variant === "primary" && "bg-blue-600 text-white",
        variant === "secondary" && "bg-gray-200 text-gray-900",
        className
      )}
      {...props}
    />
  );
}
```

---

## ✅ Testing Requirements

### Manual Testing Checklist

Before submitting a PR, verify:

- [ ] **Development server runs** without errors (`pnpm dev`)
- [ ] **Production build succeeds** (`pnpm build`)
- [ ] **Linting passes** (`pnpm lint`)
- [ ] **UI renders correctly** on desktop and mobile
- [ ] **No console errors** in browser DevTools
- [ ] **Database operations work** (if applicable)

### Future Testing (Planned)

We plan to implement:

- **Unit Tests**: Using Jest or Vitest
- **Integration Tests**: For API routes and database operations
- **E2E Tests**: Using Playwright or Cypress

---

## 🗄️ Database Changes

### Modifying the Schema

If you need to change the database schema:

1. **Edit Schema Files**:

   ```
   src/drizzle/schema/[table_name].ts
   ```

2. **Generate Migration**:

   ```bash
   pnpm db:generate
   ```

   This creates a new migration file in `drizzle/migrations/`.

3. **Review the Migration**:
   Open the generated `.sql` file and verify it's correct.

4. **Test Migration Locally**:

   ```bash
   # Reset database (WARNING: Destructive)
   pnpm db:down
   pnpm db:up
   pnpm db:migrate
   ```

5. **Document Changes**:
   Update `README.md` database schema section if structure changed.

### Migration Best Practices

- ✅ **Never edit** existing migration files
- ✅ **Always generate** new migrations for schema changes
- ✅ **Test migrations** on a clean database
- ✅ **Include rollback** strategy in PR description
- ❌ **Never delete** migration files (breaks history)

---

## 🐛 Reporting Issues

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Verify the issue** on the latest `develop` branch
3. **Check troubleshooting** in `README.md`

### Creating an Issue

Use the appropriate template:

#### Bug Report Template

```markdown
**Bug Description**
Clear description of what the bug is.

**Steps to Reproduce**

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What should happen instead.

**Screenshots**
If applicable, add screenshots.

**Environment**

- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome 120]
- Node Version: [e.g., v20.11]
- Commit Hash: [e.g., abc1234]

**Additional Context**
Any other relevant information.
```

#### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature.

**Problem It Solves**
What problem does this feature address?

**Proposed Solution**
How would you implement this?

**Alternatives Considered**
Other approaches you've thought about.

**Additional Context**
Mockups, references, or examples.
```

---

## 📞 Questions or Help?

If you have questions about contributing:

1. **Check Documentation**:
   - [README.md](./README.md) - Project overview and setup
   - [DEV_NOTES.md](./DEV_NOTES.md) - Technical notes and troubleshooting
   - [KEY_NOTES.md](./KEY_NOTES.md) - Lessons learned and solutions

2. **Ask the Team**:
   - **Lead Developer**: Wampamba Festo - [GitHub](https://github.com/Festo-Wampamba)
   - **Academic Supervisor**: Ms. Nyesiga Catherine (MUBS)

3. **Open a Discussion**:
   Use GitHub Discussions for general questions.

---

## 🙏 Thank You!

Your contributions help make **Kore-Standards** a powerful tool for Uganda's labor market. Every bug fix, feature, and documentation improvement makes a difference!

---

**Built with ❤️ by MUBS Business Computing Students**
