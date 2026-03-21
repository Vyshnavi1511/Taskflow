# ⬡ TaskFlow — Task Management SaaS

A full-featured, client-side Task Management SaaS application. Built with pure HTML, CSS, and vanilla JavaScript — no framework, no build step, just open `index.html`.

## 🚀 Features

### Views
- **Dashboard** — KPI stats, activity/status charts (Chart.js), recent activity feed, due-soon task list
- **Projects** — Card grid with progress bars, status filters, color themes, deadline tracking
- **Kanban Board** — 5-column drag-and-drop board (Backlog → Done), per-project filtering
- **Team** — Member cards with roles, task counts, invite flow, remove member

### Core Functionality
- ✅ Create / Edit / Delete tasks with full metadata (title, description, project, status, priority, assignee, due date, tags)
- ✅ Drag-and-drop Kanban cards between columns
- ✅ Project management with status, color, and deadline
- ✅ Team member management with role-based badges
- ✅ Activity log with real-time updates
- ✅ LocalStorage persistence — data survives page refresh
- ✅ Search across tasks
- ✅ Priority indicators (Low / Medium / High / Critical)
- ✅ Due date tracking with overdue/soon/ok states
- ✅ Animated stat counters
- ✅ Toast notifications
- ✅ Fully responsive with mobile sidebar

## 📁 File Structure

```
taskflow/
├── index.html    ← App shell, all views & modals
├── style.css     ← Full design system (dark theme)
├── script.js     ← All app logic + localStorage
└── README.md
```

## 🛠️ Tech Stack

| Layer      | Tech                             |
|------------|----------------------------------|
| UI         | HTML5, CSS3 (custom properties, grid, flexbox) |
| Logic      | Vanilla JavaScript (ES6+)        |
| Charts     | Chart.js 4.4 (CDN)               |
| Fonts      | Google Fonts (Syne + DM Sans)    |
| Storage    | localStorage (browser-native)    |
| Drag-Drop  | HTML5 Drag and Drop API          |

## 🌐 Deploy on GitHub Pages

1. Push to your repo
2. Settings → Pages → Source: `main`, root `/`
3. Live at `https://SherlockHolmes1210.github.io/taskflow/`

## 🔗 Add to Portfolio

In your portfolio's `index.html`, update project card 02:
```html
<a href="https://SherlockHolmes1210.github.io/taskflow/" class="project-link" target="_blank">↗ Live Demo</a>
```

---

Built by Sherlock Holmes · github.com/SherlockHolmes1210
