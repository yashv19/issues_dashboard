import Link from 'next/link'
import { notFound } from 'next/navigation'
import styles from './page.module.css'
import Image from 'next/image'
import FixWithDevinButton from './FixWithDevinButton'

export default async function IssuePage ({ params }) {
  const { id } = await params

  // Fetch specific issue from GitHub API
  const res = await fetch(
    `https://api.github.com/repos/yashv19/issues_dashboard/issues/${id}`,
    {
      headers: {
        Accept: 'application/vnd.github+json'
      },
      cache: 'no-store' // Disable caching for fresh data
    }
  )

  if (!res.ok) {
    notFound()
  }

  const issue = await res.json()

  // Fetch comments for this issue
  let comments = []
  if (issue.comments > 0) {
    const commentsRes = await fetch(issue.comments_url, {
      headers: {
        Accept: 'application/vnd.github+json'
      },
      cache: 'no-store'
    })
    if (commentsRes.ok) {
      comments = await commentsRes.json()
    }
  }

  const formatDate = dateString => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatBody = body => {
    if (!body) return null
    // Simple markdown-like formatting
    return body.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className={styles.bodyHeading}>
            {line.substring(3)}
          </h2>
        )
      }
      // List items
      if (line.startsWith('- ')) {
        return (
          <li key={index} className={styles.bodyListItem}>
            {line.substring(2)}
          </li>
        )
      }
      // Code blocks
      if (line.startsWith('```')) {
        return <div key={index} className={styles.codeBlock}></div>
      }
      // Regular paragraph
      if (line.trim()) {
        return (
          <p key={index} className={styles.bodyText}>
            {line}
          </p>
        )
      }
      return <br key={index} />
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href='/' className={styles.backLink}>
          ← Back to Issues
        </Link>

        {issue.closed_at && (
          <div className={styles.closedBanner}>
            <span className={styles.closedIcon}>✓</span>
            This issue was closed on {formatDate(issue.closed_at)}
          </div>
        )}

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
              <strong>{issue.user.login}</strong> opened this issue on{' '}
              {formatDate(issue.created_at)}
            </span>
            <span className={styles.separator}>•</span>
            <span className={styles.metaText}>
              💬 {issue.comments} comments
            </span>
          </div>

          {issue.labels.length > 0 && (
            <div className={styles.labels}>
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
          )}
        </div>

        <div className={styles.body}>
          <div className={styles.bodyHeader}>
            <div className={styles.authorInfo}>
              <Image
                src={issue.user.avatar_url}
                width={40}
                height={40}
                alt={`avatar url for ${issue.user.login}`}
                className={styles.authorAvatar}
              />
              <div>
                <div className={styles.authorName}>{issue.user.login}</div>
                <div className={styles.authorDate}>
                  commented on {formatDate(issue.created_at)}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.bodyContent}>{formatBody(issue.body)}</div>
        </div>

        {/* Comments Section */}
        {comments.length > 0 && (
          <div className={styles.commentsSection}>
            <h2 className={styles.commentsTitle}>
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </h2>
            {comments.map(comment => (
              <div key={comment.id} className={styles.comment}>
                <div className={styles.bodyHeader}>
                  <div className={styles.authorInfo}>
                    <Image
                      src={comment.user.avatar_url}
                      width={40}
                      height={40}
                      alt={`avatar url for ${comment.user.login}`}
                      className={styles.authorAvatar}
                    />
                    <div>
                      <div className={styles.authorName}>
                        {comment.user.login}
                      </div>
                      <div className={styles.authorDate}>
                        commented on {formatDate(comment.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.bodyContent}>
                  {formatBody(comment.body)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.buttonRow}>
          <FixWithDevinButton issueId={id} />
        </div>
      </div>
    </div>
  )
}
