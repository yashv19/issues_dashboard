'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import FixWithDevinButton from './FixWithDevinButton'
import ActionPlan from './ActionPlan'
import ExecutionSummary from './ExecutionSummary'
import styles from './page.module.css'

export default function DevinSection ({ issueId, issue }) {
  const router = useRouter()
  const [sessionData, setSessionData] = useState(null)
  const [error, setError] = useState(null)
  const [isPolling, setIsPolling] = useState(false)
  const pollingIntervalRef = useRef(null)

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  // Generic polling function for any Devin session
  const pollSession = async (sessionId, onSuccess, receivedFlagKey) => {
    const POLL_INTERVAL = 10000 // 10 seconds
    const MAX_POLLS = 60 // 10 minutes max (60 * 10s = 600s)

    // Use a ref to track poll count across interval calls
    const pollCountRef = { current: 0 }

    const checkSession = async () => {
      try {
        pollCountRef.current++

        // Check localStorage to see if data was already received (e.g., by another tab or previous poll)
        const storageKey = `issue_${issueId}`
        const storedData = localStorage.getItem(storageKey)
        if (storedData) {
          const sessionIds = JSON.parse(storedData)
          if (sessionIds[receivedFlagKey]) {
            // Data already received, stop polling
            console.log(`Session ${sessionId} already marked as received in localStorage`)
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current)
              pollingIntervalRef.current = null
            }
            setIsPolling(false)
            return true
          }
        }

        console.log(`Polling session ${sessionId} (attempt ${pollCountRef.current})`)

        const res = await fetch(
          `/api/issues/${issueId}?session_id=${sessionId}`
        )
        const data = await res.json()

        if (data.success && data.structured_output) {
          // Check if we got valid output
          if (data.structured_output.action_plan || data.structured_output.execution_summary) {
            // Success - stop polling
            console.log(`Received structured output for session ${sessionId}`)
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current)
              pollingIntervalRef.current = null
            }
            setIsPolling(false)
            onSuccess(data.structured_output)
            return true
          }
        }

        if (pollCountRef.current >= MAX_POLLS) {
          // Timeout
          console.log(`Session ${sessionId} timed out after ${pollCountRef.current} polls`)
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
          }
          setIsPolling(false)
          setError('Devin session timed out. Please try again.')
          return true
        }

        return false
      } catch (err) {
        console.error('Error polling session:', err)
        return false
      }
    }

    // Try once immediately
    const completed = await checkSession()

    if (!completed) {
      // Start polling
      setIsPolling(true)
      pollingIntervalRef.current = setInterval(checkSession, POLL_INTERVAL)
    }
  }

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
          localStorage.removeItem(storageKey)
          return
        }

        // Check action plan session
        if (sessionIds.action_plan_session_id && !sessionIds.action_plan_received) {
          await pollSession(sessionIds.action_plan_session_id, (structured_output) => {
            setSessionData(prev => ({
              ...prev,
              plan: structured_output.action_plan,
              confidence: structured_output.confidence_score
            }))
            // Mark as received
            sessionIds.action_plan_received = true
            localStorage.setItem(storageKey, JSON.stringify(sessionIds))
          }, 'action_plan_received')
        } else if (sessionIds.action_plan_session_id) {
          // Already received, fetch once
          const res = await fetch(
            `/api/issues/${issueId}?session_id=${sessionIds.action_plan_session_id}`
          )
          const data = await res.json()
          if (data.success && data.structured_output?.action_plan) {
            setSessionData(prev => ({
              ...prev,
              plan: data.structured_output.action_plan,
              confidence: data.structured_output.confidence_score
            }))
          }
        }

        // Check execution session
        if (sessionIds.execution_session_id && !sessionIds.execution_received) {
          await pollSession(sessionIds.execution_session_id, (structured_output) => {
            setSessionData(prev => ({
              ...prev,
              summary: structured_output.execution_summary
            }))
            // Mark as received
            sessionIds.execution_received = true
            localStorage.setItem(storageKey, JSON.stringify(sessionIds))
            // Refresh to show updated issue
            router.refresh()
          }, 'execution_received')
        } else if (sessionIds.execution_session_id) {
          // Already received, fetch once
          const res = await fetch(
            `/api/issues/${issueId}?session_id=${sessionIds.execution_session_id}`
          )
          const data = await res.json()
          if (data.success && data.structured_output?.execution_summary) {
            setSessionData(prev => ({
              ...prev,
              summary: data.structured_output.execution_summary
            }))
          }
        }
      } catch (err) {
        console.error('Error loading session data:', err)
      }
    }

    loadSessionData()
  }, [issueId, router])

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

    if (data.success) {
      // Store session ID in localStorage
      if (data.session?.session_id) {
        const storageKey = `issue_${issueId}`
        const storageData = {
          action_plan_session_id: data.session.session_id,
          action_plan_received: false
        }
        localStorage.setItem(storageKey, JSON.stringify(storageData))
        console.log(
          `Stored session ID ${data.session.session_id} for issue #${issueId}`
        )

        // Start polling for results
        await pollSession(data.session.session_id, (structured_output) => {
          setSessionData({
            plan: structured_output.action_plan,
            confidence: structured_output.confidence_score
          })
          // Mark as received
          storageData.action_plan_received = true
          localStorage.setItem(storageKey, JSON.stringify(storageData))
        }, 'action_plan_received')
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

    if (data.success) {
      // Store execution session ID in localStorage
      if (data.session?.session_id) {
        const storageKey = `issue_${issueId}`
        const existingData = localStorage.getItem(storageKey)
        let storageData = existingData ? JSON.parse(existingData) : {}

        storageData.execution_session_id = data.session.session_id
        storageData.execution_received = false
        localStorage.setItem(storageKey, JSON.stringify(storageData))
        console.log(
          `Stored execution session ID ${data.session.session_id} for issue #${issueId}`
        )

        // Start polling for results
        await pollSession(data.session.session_id, (structured_output) => {
          setSessionData(prev => ({
            ...prev,
            summary: structured_output.execution_summary
          }))
          // Mark as received
          storageData.execution_received = true
          localStorage.setItem(storageKey, JSON.stringify(storageData))
          // Refresh to show updated issue
          router.refresh()
        }, 'execution_received')
      }
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
        isPolling={isPolling}
      />
    </div>
  )
}
