import Link from "next/link";
import { issues } from "@/data/issues";
import styles from "./page.module.css";

export default function Home() {
  const openIssues = issues.filter(issue => issue.state === 'open');
  const closedIssues = issues.filter(issue => issue.state === 'closed');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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
        <div className={styles.issuesList}>
          {issues.map((issue) => (
            <Link
              href={`/issue/${issue.id}`}
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
                  {issue.labels.map((label) => (
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
                {issue.comments > 0 && (
                  <>
                    <span className={styles.separator}>•</span>
                    <span className={styles.issueComments}>
                      💬 {issue.comments}
                    </span>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
