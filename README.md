# LifeSpent

> A quiet reflection on time. No judgment, just math.

**LifeSpent** is a minimalist web application designed to show you exactly how much of your life has already passed, based on your age and your country’s median life expectancy. It is built to break the illusion of "infinite youth" and encourage a calm, intentional approach to the time we have left.

---

## 🕊️ Philosophy

LifeSpent is not a motivational tool, nor is it a memento mori designed to evoke fear. It is a mirror held up to time.

- **Objective Reality**: We use real actuarial data (median age: 73 for men, 79 for women by default).
- **Ceremonial Design**: A dark, modern interface that prioritizes clarity and reflection.
- **Zero Friction**: No accounts, no tracking, just the numbers.

## 🛠️ Tech Stack

Built with a focus on performance, type safety, and modern standards:

- **Frontend**: [Svelte 4](https://svelte.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/nicejade/life-spent.git
cd life-spent

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📂 Project Structure

```bash
src/
├── lib/               # Core logic and types
│   ├── types.ts       # Shared TypeScript interfaces
│   └── lifePercent.ts # Pure calculation utilities
├── components/        # Svelte UI components
│   ├── InputPanel.svelte
│   └── ResultSummary.svelte
├── styles/            # Minimal global styles
│   └── tailwind.css
├── App.svelte         # Main application entry
└── main.ts            # Bootstrapping
```

## 🎨 Design Principles

- **Restraint**: Minimalist copy and steady typography.
- **Glassmorphism**: Elegant, translucent cards for a layered, modern feel.
- **Accessibility**: Semantic HTML and full ARIA support by default.
- **Responsive**: Mobile-first design for reflection on the go.

---

Built with care to remind us that every second counts.
