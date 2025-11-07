'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FixWithDevinButton from './FixWithDevinButton'
import ActionPlan from './ActionPlan'
import ExecutionSummary from './ExecutionSummary'
import styles from './page.module.css'

export default function DevinSection ({ issueId, issue }) {
  const router = useRouter()
  const [sessionData, setSessionData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadSessionData = async () => {
      try {
        const storageKey = `issue_${issueId}`
        const storedData = localStorage.getItem(storageKey)

        if (!storedData) return

        let sessionIds
        try {
          sessionIds = JSON.parse(storedData)
        } catch (parseError) {
          console.error('Failed to parse localStorage data:', parseError)
          // Clear invalid data
          localStorage.removeItem(storageKey)
          return
        }

        // Fetch both action plan and execution summary if both IDs exist
        const newSessionData = {}

        if (sessionIds.action_plan_session_id) {
          const res = await fetch(
            `/api/issues/${issueId}?session_id=${sessionIds.action_plan_session_id}`
          )
          const data = await res.json()

          if (data.success && data.structured_output) {
            if (data.structured_output.action_plan) {
              newSessionData.plan = data.structured_output.action_plan
              newSessionData.confidence =
                data.structured_output.confidence_score
            }
          }
        }

        if (sessionIds.execution_session_id) {
          const res = await fetch(
            `/api/issues/${issueId}?session_id=${sessionIds.execution_session_id}`
          )
          const data = await res.json()

          if (data.success && data.structured_output) {
            if (data.structured_output.execution_summary) {
              newSessionData.summary = data.structured_output.execution_summary
            }
          }
        }

        if (Object.keys(newSessionData).length > 0) {
          setSessionData(newSessionData)
        }
      } catch (err) {
        console.error('Error loading session data:', err)
      }
    }

    loadSessionData()
  }, [issueId])

  const createActionPlan = async () => {
    const res = await fetch(`/api/issues/${issueId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        issue: {
          number: issue.number,
          title: issue.title,
          body: issue.body,
          state: issue.state,
          labels: issue.labels,
          user: issue.user,
          html_url: issue.html_url,
          created_at: issue.created_at
        }
      })
    })

    const data = await res.json()
    console.log('Create action plan response:', data)

    if (data.success) {
      // Store only session ID in localStorage
      if (data.session?.session_id) {
        const storageKey = `issue_${issueId}`
        const storageData = {
          action_plan_session_id: data.session.session_id
        }
        localStorage.setItem(storageKey, JSON.stringify(storageData))
        console.log(
          `Stored session ID ${data.session.session_id} for issue #${issueId}`
        )

        // Fetch the session data from the GET route
        const sessionRes = await fetch(
          `/api/issues/${issueId}?session_id=${data.session.session_id}`
        )
        const sessionData = await sessionRes.json()

        if (sessionData.success && sessionData.structured_output) {
          if (sessionData.structured_output.action_plan) {
            setSessionData({
              plan: sessionData.structured_output.action_plan,
              confidence: sessionData.structured_output.confidence_score
            })
          }
        }
      }
    } else {
      setError(data.error || 'Failed to get response from Devin')
    }
  }

  const executePlan = async sessionId => {
    const res = await fetch(`/api/issues/${issueId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        session_id: sessionId,
        issue: {
          number: issue.number,
          title: issue.title
        },
        action_plan: sessionData?.plan,
        confidence: sessionData?.confidence
      })
    })

    const data = await res.json()
    console.log('Execute plan response:', data)

    if (data.success && data.summary) {
      console.log('Plan execution completed with summary:', data.summary)

      // Update localStorage with execution session ID (keeping action_plan_session_id)
      const storageKey = `issue_${issueId}`
      const existingData = localStorage.getItem(storageKey)
      let storageData = existingData ? JSON.parse(existingData) : {}

      storageData.execution_session_id = data.session_id || sessionId
      localStorage.setItem(storageKey, JSON.stringify(storageData))
      console.log(
        `Updated localStorage with execution session ID for issue #${issueId}`
      )

      // Trigger page refresh to fetch updated issue and comments
      // This will also trigger useEffect to refetch all session data
      router.refresh()
    } else {
      setError(data.error || 'Failed to execute plan')
    }
  }

  return (
    <div className={styles.devinContent}>
      <h2>Devin Actions</h2>

      {error && (
        <div className={styles.devinError}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {sessionData?.plan && (
        <ActionPlan
          plan={sessionData.plan}
          confidence={sessionData.confidence}
        />
      )}

      {sessionData?.summary && (
        <ExecutionSummary summary={sessionData.summary} />
      )}
      <FixWithDevinButton
        issueId={issueId}
        createActionPlan={createActionPlan}
        executePlan={executePlan}
        setError={setError}
      />
    </div>
  )
}
