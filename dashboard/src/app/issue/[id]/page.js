import Link from "next/link";
import { getIssueById } from "@/data/issues";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

export default async function IssuePage({ params }) {
  const { id } = await params;
  const issue = getIssueById(id);

  if (!issue) {
    notFound();
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatBody = (body) => {
    if (!body) return null;
    // Simple markdown-like formatting
    return body.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('## ')) {
        return <h2 key={index} className={styles.bodyHeading}>{line.substring(3)}</h2>;
      }
      // List items
      if (line.startsWith('- ')) {
        return <li key={index} className={styles.bodyListItem}>{line.substring(2)}</li>;
      }
      // Code blocks
      if (line.startsWith('```')) {
        return <div key={index} className={styles.codeBlock}></div>;
      }
      // Regular paragraph
      if (line.trim()) {
        return <p key={index} className={styles.bodyText}>{line}</p>;
      }
      return <br key={index} />;
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          ← Back to Issues
        </Link>

        <div className={styles.header}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{issue.title}</h1>
            <span className={`${styles.badge} ${styles[issue.state]}`}>
              {issue.state}
            </span>
          </div>

          <div className={styles.meta}>
            <span className={styles.issueNumber}>#{issue.number}</span>
            <span className={styles.separator}>•</span>
            <span className={styles.metaText}>
              <strong>{issue.user.login}</strong> opened this issue on {formatDate(issue.created_at)}
            </span>
            {issue.comments > 0 && (
              <>
                <span className={styles.separator}>•</span>
                <span className={styles.metaText}>{issue.comments} comments</span>
              </>
            )}
          </div>

          {issue.labels.length > 0 && (
            <div className={styles.labels}>
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
          )}
        </div>

        <div className={styles.body}>
          <div className={styles.bodyHeader}>
            <div className={styles.authorInfo}>
              <div className={styles.authorAvatar}>
                {issue.user.login.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className={styles.authorName}>{issue.user.login}</div>
                <div className={styles.authorDate}>
                  commented on {formatDate(issue.created_at)}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.bodyContent}>
            {formatBody(issue.body)}
          </div>
        </div>

        {issue.closed_at && (
          <div className={styles.closedBanner}>
            <span className={styles.closedIcon}>✓</span>
            This issue was closed on {formatDate(issue.closed_at)}
          </div>
        )}

        {issue.state === 'open' && (
          <div className={styles.statusBanner}>
            <span className={styles.openIcon}>○</span>
            This issue is open and awaiting resolution
          </div>
        )}
      </div>
    </div>
  );
}
