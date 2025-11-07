'use client'

import styles from './page.module.css'
import { formatBody } from '../../_utils/formatContent'

export default function ExecutionSummary({ summary }) {
  return (
    <div className={styles.devinResponse}>
      <div className={styles.responseHeader}>
        <h3 className={styles.responseTitle}>Execution Summary</h3>
      </div>
      <div className={styles.responsePlan}>
        {formatBody(summary)}
      </div>
    </div>
  )
}
