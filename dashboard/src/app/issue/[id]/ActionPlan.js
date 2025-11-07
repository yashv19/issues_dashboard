'use client'

import styles from './page.module.css'
import { formatBody } from '../../_utils/formatContent'

export default function ActionPlan({ plan, confidence }) {
  return (
    <div className={styles.devinResponse}>
      <div className={styles.responseHeader}>
        <h3 className={styles.responseTitle}>Devin's Action Plan</h3>
        <div className={styles.confidenceBadge}>
          Confidence: {confidence}%
        </div>
      </div>
      <div className={styles.responsePlan}>
        {formatBody(plan)}
      </div>
    </div>
  )
}
