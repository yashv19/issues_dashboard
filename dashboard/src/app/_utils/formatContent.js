import styles from '../page.module.css'

export const formatBody = body => {
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

export const formatDate = dateString => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
