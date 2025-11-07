'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'

export default function FixWithDevinButton({ issueId, createActionPlan, executePlan, setError, isPolling }) {
  const [loading, setLoading] = useState(false)
  const [hasExistingSession, setHasExistingSession] = useState(false)
  const [isExecuted, setIsExecuted] = useState(false)

  useEffect(() => {
    // Check if there's an existing session in localStorage
    const storageKey = `issue_${issueId}`
    const storedData = localStorage.getItem(storageKey)

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        // Has existing session if action plan received but not executed
        const hasActionPlan = parsedData.action_plan_received && !parsedData.execution_received
        setHasExistingSession(hasActionPlan)
        setIsExecuted(parsedData.execution_received || false)
      } catch (err) {
        console.error('Error parsing localStorage data:', err)
      }
    }
  }, [issueId])

  const handleClick = async () => {
    setLoading(true)
    setError(null)

    try {
      const storageKey = `issue_${issueId}`
      const storedData = localStorage.getItem(storageKey)

      if (storedData) {
        const parsedData = JSON.parse(storedData)

        // If we have an action plan but haven't executed yet
        if (parsedData.action_plan_received && !parsedData.execution_received && parsedData.action_plan_session_id) {
          // Execute the existing plan
          await executePlan(parsedData.action_plan_session_id)
          setIsExecuted(true)
          setHasExistingSession(false)
        }
      } else {
        // Create a new action plan
        await createActionPlan()
        setHasExistingSession(true)
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getButtonText = () => {
    if (loading || isPolling) return 'Devin is working...'
    if (isExecuted) return 'Pending PR Approval'
    if (hasExistingSession) return '✨ Execute plan'
    return '✨ Fix with Devin'
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || isExecuted || isPolling}
      className={styles.fixButton}
    >
      {getButtonText()}
    </button>
  )
}
