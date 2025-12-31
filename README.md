# Admin Dashboard (Frontend)

A React + Vite admin dashboard that displays and edits items from a REST API.  
Features include server-side filtering, sorting, pagination, a detail panel edit flow, skeleton loading rows, and keyboard navigation.

![Admin Dashboard Screenshot](images/dashboard.png)

## Features

- **Data table**
  - Server-side **sorting** (e.g., created date, status, priority)
  - Server-side **filtering** (status, category, priority)
  - **Search** (query string)
  - **Pagination**
  - **Sticky table header**
  - Loading + empty + error states

- **Detail panel**
  - Click a row to view item details
  - Edit fields and save changes
  - “Saving…” state to prevent double submits

- **UX polish**
  - Skeleton loading rows
  - Row hover + selected state
  - Keyboard navigation:
    - Focus table (click inside)
    - **↑ / ↓** moves the active row
    - **Enter** selects/opens the item
    - **Esc** closes the panel

## Tech Stack

- React
- Vite
- Fetch API
- Sass (SCSS)

## Project Structure

- src/
    - api/
        items.js # API helpers (fetch list, update item, build query string)
    - components/
        FiltersBar.jsx # Search + filters + per-page controls
        PaginationBar.jsx # Prev/Next + page info
        ItemsTable.jsx # Table rendering + row interaction + keyboard focus zone
        DetailPanel.jsx # Item editing UI + saving overlay
        SortIcon.jsx # Sort indicator icon used by table headers
    - styles/
        index.scss # Sass entry point
        _variables.scss # Shared design tokens
        _layout.scss # Layout + page structure
        _table.scss # Table + pills + skeleton rows + sticky header
        _panel.scss # Detail panel styles (sticky panel + overlay)
    - App.jsx # State + data fetching orchestration
    - main.jsx # App bootstrap


## How It Works

- The frontend keeps table controls in state:
  - `q, status, category, priority, sort, order, page, limit`
- Those values are converted into a query string and sent to the backend:
  - `GET /items?q=...&status=...&sort=...&page=...`
- The backend returns:
  - `data`: the current page of rows
  - `meta`: pagination metadata (page, total, totalPages)
- The table renders rows, and selecting a row opens a detail panel.
- Saving changes uses:
  - `PATCH /items/:id` (then refreshes the table)

## Getting Started (Local Dev)

### 1) Install
`npm install`

### 2) Configure environment variables
Create a .env file in the project root:
`VITE_API_BASE_URL=http://localhost:3000`

The backend must be running for the dashboard to load data.

### 3) Run the dev server
`npm run dev`

Open the app at the URL Vite prints (http://localhost:5173).

### Scripts
- `npm run dev` — start development server

- `npm run build` — create production build

- `npm run preview` — preview the production build locally


## Notes

- Sorting/filtering/pagination are server-side to keep the frontend fast and keep business logic centralized in the API.

- The table wrapper is focusable to support keyboard navigation without creating dozens of tab stops.


## Roadmap Ideas

- Inline editing in table rows

- Column resizing / column visibility toggles

- Persist filters in URL (shareable table state)

- Better validation and inline form errors in the detail panel
