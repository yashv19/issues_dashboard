import Link from 'next/link'
import styles from './page.module.css'

export default async function Home () {
  // Fetch issues from GitHub API
  const res = await fetch(
    'https://api.github.com/repos/yashv19/issues_dashboard/issues?state=all',
    {
      headers: {
        Accept: 'application/vnd.github+json'
      },
      cache: 'no-store' // Disable caching for fresh data
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch issues')
  }

  const issues = await res.json()

  const openIssues = issues.filter(issue => issue.state === 'open')
  const closedIssues = issues.filter(issue => issue.state === 'closed')

  const formatDate = dateString => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>GitHub Issues Dashboard</h1>
        <div className={styles.stats}>
          <span className={styles.statBadge}>
            <span className={styles.openDot}></span>
            {openIssues.length} Open
          </span>
          <span className={styles.statBadge}>
            <span className={styles.closedDot}></span>
            {closedIssues.length} Closed
          </span>
        </div>
      </header>

      <main className={styles.main}>
        {issues.length === 0 && <div>No issues</div>}
        {issues.length > 0 && (
          <div className={styles.issuesList}>
            {issues.map(issue => (
              <Link
                href={`/issue/${issue.number}`}
                key={issue.id}
                className={styles.issueCard}
              >
                <div className={styles.issueHeader}>
                  <div className={styles.issueTitleRow}>
                    <h2 className={styles.issueTitle}>{issue.title}</h2>
                    <span className={`${styles.badge} ${styles[issue.state]}`}>
                      {issue.state}
                    </span>
                  </div>
                  <div className={styles.issueLabels}>
                    {issue.labels.map(label => (
                      <span
                        key={label.name}
                        className={styles.label}
                        style={{ backgroundColor: `#${label.color}` }}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.issueMeta}>
                  <span className={styles.issueNumber}>#{issue.number}</span>
                  <span className={styles.separator}>•</span>
                  <span className={styles.issueAuthor}>
                    opened by {issue.user.login}
                  </span>
                  <span className={styles.separator}>•</span>
                  <span className={styles.issueDate}>
                    {formatDate(issue.created_at)}
                  </span>
                  <span className={styles.separator}>•</span>
                  <span className={styles.issueComments}>
                    💬 {issue.comments} Comments
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
