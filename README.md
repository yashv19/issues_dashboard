# Issues Dashboard

A Next.js web application that provides an enhanced interface for viewing and managing GitHub issues from the `yashv19/issues_dashboard` repository. The dashboard serves as a centralized hub for issue tracking with planned integration for automated issue resolution.

## Features

- **Issue Browsing**: View all repository issues with filterable views by status (open/closed)
- **Detailed Issue View**: Access comprehensive information including descriptions, comments, labels, and metadata
- **Rich Content Display**: Formatted markdown rendering with support for headers, lists, and code blocks
- **User Profiles**: Display GitHub user avatars and author information
- **Status Tracking**: Visual indicators for issue states with color-coded badges
- **Responsive Design**: Mobile and desktop layouts with dark mode support
- **Automated Resolution**: Planned integration with Devin for automated issue fixing (coming soon)

## Repository Structure

```
issues_dashboard/
├── dashboard/                    # Next.js application
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   │   ├── page.js          # Home page - issue list
│   │   │   ├── page.module.css  # Home page styles
│   │   │   ├── globals.css      # Global styles and CSS variables
│   │   │   ├── layout.js        # Root layout with fonts and metadata
│   │   │   ├── issue/
│   │   │   │   └── [id]/        # Dynamic issue detail pages
│   │   │   │       ├── page.js
│   │   │   │       ├── page.module.css
│   │   │   │       └── FixWithDevinButton.js
│   │   │   └── api/
│   │   │       └── issues/
│   │   │           └── [id]/
│   │   │               └── route.js  # API endpoint for Devin integration
│   │   └── data/
│   │       └── issues.js        # Legacy data module (unused)
│   ├── public/                  # Static assets (SVG icons, favicon)
│   ├── next.config.mjs          # Next.js configuration
│   ├── jsconfig.json            # Path aliases and module resolution
│   ├── eslint.config.mjs        # Code quality rules
│   ├── package.json             # Dependencies and scripts
│   └── README.md                # Dashboard-specific documentation
├── AGENTS.md                    # Agent configuration
└── README.md                    # This file
```

## Prerequisites

Before running the Issues Dashboard, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For cloning the repository

## Quick Start

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yashv19/issues_dashboard.git
cd issues_dashboard
```

2. Navigate to the dashboard directory:
```bash
cd dashboard
```

3. Install dependencies:
```bash
npm install
```

### Running the Application

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

Build the application:
```bash
npm run build
```

Run the production build:
```bash
npm run start
```

### Code Quality

Run ESLint to check code quality:
```bash
npm run lint
```

## Technology Stack

### Frontend
- **Next.js 16.0.1**: React framework with App Router for server-side rendering
- **React 19.2.0**: UI component library
- **CSS Modules**: Scoped component styling
- **Geist Font**: Custom typography from Vercel

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **GitHub REST API**: Issue data source

### Development Tools
- **ESLint**: Code quality and consistency
- **React Compiler**: Automatic component memoization for performance

### Key Features
- **Server Components**: Zero JavaScript sent to client for most pages
- **Dynamic Routes**: URL-based routing for issue details
- **Image Optimization**: Next.js Image component with remote pattern support
- **Dark Mode**: CSS custom properties with prefers-color-scheme support

## Project Documentation

### Application Architecture

The Issues Dashboard uses Next.js App Router with a server-first architecture:

- **Server Components** (default): Pages that fetch data and render on the server, reducing client-side JavaScript
- **Client Components**: Interactive elements like the "Fix with Devin" button that require browser APIs
- **API Routes**: Backend endpoints for triggering automated workflows

### Key Components

**Home Page** (`src/app/page.js`): Displays all issues with statistics and filtering by state.

**Issue Detail Page** (`src/app/issue/[id]/page.js`): Shows comprehensive issue information including comments, with markdown-like formatting support.

**FixWithDevinButton** (`src/app/issue/[id]/FixWithDevinButton.js`): Client-side button for triggering automated issue resolution (placeholder implementation).

### Data Flow

1. Server components fetch issue data directly from GitHub API
2. Data is rendered to HTML on the server
3. Minimal JavaScript is sent to the client for interactivity
4. Client components handle user interactions and API calls

### Styling System

The application uses CSS Modules for component-scoped styles and CSS custom properties for theming:

- Light/dark mode support via `prefers-color-scheme`
- Consistent color palette using CSS variables
- Responsive layouts with flexbox and grid
- Geist font family for typography

## Development Workflow

### Branch Strategy

1. Create feature branches from `main`
2. Use descriptive branch names (e.g., `feature/add-filtering`, `fix/comment-rendering`)
3. Submit pull requests for code review
4. Squash commits before merging to maintain clean history

### Making Changes

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and test locally:
```bash
npm run dev
```

3. Check code quality:
```bash
npm run lint
```

4. Commit your changes:
```bash
git add .
git commit -m "Description of changes"
```

5. Push to remote:
```bash
git push origin feature/your-feature-name
```

6. Create a pull request on GitHub

### Code Conventions

- Use existing code style and patterns
- Place imports at the top of files
- Follow Next.js best practices for server/client components
- Use CSS Modules for component styles
- Avoid inline comments unless necessary for complex logic

### Testing

Currently, the project does not have automated tests. Manual testing should include:

- Verifying issue list loads correctly
- Checking issue detail pages render properly
- Testing responsive layouts on mobile and desktop
- Validating dark mode appearance
- Ensuring links and navigation work as expected

## License

This project is private and not currently licensed for public use.

## Contributing

This is a private repository. If you have access and would like to contribute:

1. Fork the repository (if applicable)
2. Create a feature branch
3. Make your changes following the development workflow
4. Submit a pull request with a clear description of changes
5. Wait for code review and address any feedback

For questions or issues, please open a GitHub issue in this repository.

---

**Built with Next.js** | **Powered by GitHub API** | **Automated by Devin (coming soon)**
