import styles from '../issue/[id]/page.module.css'

export const formatBody = body => {
  if (!body) return null
  
  const lines = body.split('\n')
  const result = []
  let inCodeBlock = false
  let codeLines = []
  let codeLanguage = ''
  let elementKey = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true
        codeLanguage = line.substring(3).trim()
        codeLines = []
      } else {
        result.push(
          <div key={elementKey++} className={styles.codeBlock}>
            <pre>{codeLines.join('\n')}</pre>
          </div>
        )
        inCodeBlock = false
        codeLines = []
        codeLanguage = ''
      }
      continue
    }

    if (inCodeBlock) {
      codeLines.push(line)
      continue
    }

    // Headers
    if (line.startsWith('## ')) {
      result.push(
        <h2 key={elementKey++} className={styles.bodyHeading}>
          {line.substring(3)}
        </h2>
      )
      continue
    }
    
    // List items
    if (line.startsWith('- ')) {
      result.push(
        <li key={elementKey++} className={styles.bodyListItem}>
          {line.substring(2)}
        </li>
      )
      continue
    }

    // Regular paragraph
    if (line.trim()) {
      result.push(
        <p key={elementKey++} className={styles.bodyText}>
          {line}
        </p>
      )
    } else {
      result.push(<br key={elementKey++} />)
    }
  }

  if (inCodeBlock && codeLines.length > 0) {
    result.push(
      <div key={elementKey++} className={styles.codeBlock}>
        <pre>{codeLines.join('\n')}</pre>
      </div>
    )
  }

  return result
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
