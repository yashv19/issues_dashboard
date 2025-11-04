export const issues = [
  {
    id: 1,
    number: 1234,
    title: "Fix memory leak in dashboard component",
    state: "open",
    created_at: "2025-01-15T10:30:00Z",
    updated_at: "2025-01-16T14:20:00Z",
    user: {
      login: "johndoe",
      avatar_url: "https://avatars.githubusercontent.com/u/1?v=4"
    },
    labels: [
      { name: "bug", color: "d73a4a" },
      { name: "high priority", color: "b60205" }
    ],
    comments: 5,
    body: "## Description\n\nThere's a memory leak occurring in the dashboard component when users navigate between tabs rapidly. The leak appears to be related to event listeners not being properly cleaned up.\n\n## Steps to Reproduce\n1. Open the dashboard\n2. Rapidly switch between tabs 10-15 times\n3. Check memory usage in DevTools\n\n## Expected Behavior\nMemory should remain stable\n\n## Actual Behavior\nMemory increases by ~50MB with each tab switch\n\n## Environment\n- Browser: Chrome 120\n- OS: macOS Sonoma\n- Version: 2.1.0"
  },
  {
    id: 2,
    number: 1235,
    title: "Add dark mode support",
    state: "open",
    created_at: "2025-01-14T09:15:00Z",
    updated_at: "2025-01-17T11:45:00Z",
    user: {
      login: "sarahsmith",
      avatar_url: "https://avatars.githubusercontent.com/u/2?v=4"
    },
    labels: [
      { name: "enhancement", color: "a2eeef" },
      { name: "good first issue", color: "7057ff" }
    ],
    comments: 12,
    body: "## Feature Request\n\nWould be great to have dark mode support for the entire application.\n\n## Proposed Solution\nImplement theme toggle that switches between light and dark modes, persisting user preference in localStorage.\n\n## Additional Context\nMany users work late hours and would appreciate a dark theme option."
  },
  {
    id: 3,
    number: 1236,
    title: "API endpoint returning 500 error for invalid user input",
    state: "open",
    created_at: "2025-01-13T16:20:00Z",
    updated_at: "2025-01-13T16:20:00Z",
    user: {
      login: "mikejohnson",
      avatar_url: "https://avatars.githubusercontent.com/u/3?v=4"
    },
    labels: [
      { name: "bug", color: "d73a4a" },
      { name: "backend", color: "fbca04" }
    ],
    comments: 3,
    body: "## Bug Report\n\nThe `/api/users/update` endpoint returns a 500 error instead of proper validation error when invalid data is sent.\n\n## Steps to Reproduce\n```bash\ncurl -X POST https://api.example.com/users/update \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"email\": \"invalid-email\"}'\n```\n\n## Expected Response\n400 Bad Request with validation errors\n\n## Actual Response\n500 Internal Server Error"
  },
  {
    id: 4,
    number: 1237,
    title: "Improve documentation for authentication flow",
    state: "open",
    created_at: "2025-01-12T13:45:00Z",
    updated_at: "2025-01-15T10:30:00Z",
    user: {
      login: "emilychen",
      avatar_url: "https://avatars.githubusercontent.com/u/4?v=4"
    },
    labels: [
      { name: "documentation", color: "0075ca" }
    ],
    comments: 2,
    body: "## Documentation Request\n\nThe current authentication documentation is incomplete and doesn't cover OAuth flow properly.\n\n## What's Missing\n- OAuth 2.0 implementation details\n- Token refresh mechanism\n- Error handling examples\n\n## Suggested Improvements\nAdd step-by-step guide with code examples for each authentication method."
  },
  {
    id: 5,
    number: 1238,
    title: "Performance optimization for large data sets",
    state: "open",
    created_at: "2025-01-11T08:00:00Z",
    updated_at: "2025-01-16T15:20:00Z",
    user: {
      login: "davidlee",
      avatar_url: "https://avatars.githubusercontent.com/u/5?v=4"
    },
    labels: [
      { name: "enhancement", color: "a2eeef" },
      { name: "performance", color: "5319e7" }
    ],
    comments: 8,
    body: "## Performance Issue\n\nThe table component becomes sluggish when rendering more than 1000 rows.\n\n## Proposed Solution\n- Implement virtual scrolling\n- Add pagination options\n- Lazy load data as user scrolls\n\n## Benchmarks\n- Current: 3-4 seconds to render 1000 rows\n- Target: <500ms for any data set size"
  },
  {
    id: 6,
    number: 1239,
    title: "Add unit tests for utility functions",
    state: "closed",
    created_at: "2025-01-10T12:30:00Z",
    updated_at: "2025-01-14T17:00:00Z",
    closed_at: "2025-01-14T17:00:00Z",
    user: {
      login: "alexwang",
      avatar_url: "https://avatars.githubusercontent.com/u/6?v=4"
    },
    labels: [
      { name: "testing", color: "fef2c0" }
    ],
    comments: 4,
    body: "## Testing Task\n\nAdd comprehensive unit tests for all utility functions in `/src/utils`.\n\n## Coverage Goals\n- Aim for 90%+ code coverage\n- Include edge cases\n- Add integration tests for complex functions\n\n## Status\n✅ Completed - All utility functions now have tests with 95% coverage"
  },
  {
    id: 7,
    number: 1240,
    title: "Mobile responsive design issues on tablets",
    state: "open",
    created_at: "2025-01-09T14:15:00Z",
    updated_at: "2025-01-16T09:30:00Z",
    user: {
      login: "lisapark",
      avatar_url: "https://avatars.githubusercontent.com/u/7?v=4"
    },
    labels: [
      { name: "bug", color: "d73a4a" },
      { name: "UI/UX", color: "d4c5f9" }
    ],
    comments: 6,
    body: "## UI Bug\n\nThe navigation menu breaks on tablet devices (768px - 1024px width).\n\n## Screenshots\n[Attach screenshots showing the issue]\n\n## Affected Devices\n- iPad Air\n- iPad Pro\n- Galaxy Tab\n\n## Expected Behavior\nNavigation should adapt smoothly to tablet screen sizes"
  },
  {
    id: 8,
    number: 1241,
    title: "Implement user notification system",
    state: "open",
    created_at: "2025-01-08T11:20:00Z",
    updated_at: "2025-01-17T08:15:00Z",
    user: {
      login: "chrismartin",
      avatar_url: "https://avatars.githubusercontent.com/u/8?v=4"
    },
    labels: [
      { name: "enhancement", color: "a2eeef" },
      { name: "feature", color: "84b6eb" }
    ],
    comments: 15,
    body: "## Feature Request\n\nImplement a real-time notification system for user actions and updates.\n\n## Requirements\n- Toast notifications for user actions\n- Bell icon with notification count\n- Notification history panel\n- Mark as read/unread functionality\n- Push notifications (optional)\n\n## Technical Approach\n- WebSocket connection for real-time updates\n- Local state management for notification queue\n- Persistence in database"
  }
];

export function getIssueById(id) {
  return issues.find(issue => issue.id === parseInt(id));
}

export function getOpenIssues() {
  return issues.filter(issue => issue.state === 'open');
}

export function getClosedIssues() {
  return issues.filter(issue => issue.state === 'closed');
}
