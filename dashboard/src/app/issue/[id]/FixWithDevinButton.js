'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function FixWithDevinButton({ issueId }) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/issues/${issueId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await res.json()
      console.log('Response:', data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.button}>
      <button
        onClick={handleClick}
        disabled={loading}
        className={styles.fixButton}
      >
        {loading ? 'Processing...' : 'Fix with Devin'}
      </button>
    </div>
  )
}
