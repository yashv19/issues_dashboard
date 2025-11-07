import { NextResponse } from 'next/server'

// GET /api/issues/[id] - Retrieve existing Devin session
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'session_id is required' },
        { status: 400 }
      )
    }

    const DEVIN_API_KEY = process.env.DEVIN_API_KEY

    console.log(`Fetching Devin session ${sessionId} for issue #${id}`)

    // Fetch session status from Devin API
    const statusResponse = await fetch(
      `https://api.devin.ai/v1/sessions/${sessionId}`,
      {
        headers: {
          'Authorization': `Bearer ${DEVIN_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!statusResponse.ok) {
      const errorText = await statusResponse.text()
      console.error('Devin API error:', errorText)
      throw new Error(`Devin API responded with status: ${statusResponse.status}`)
    }

    const sessionData = await statusResponse.json()
    console.log('Session data retrieved:', sessionData)

    return NextResponse.json({
      success: true,
      structured_output: sessionData.structured_output ? {...sessionData.structured_output} : null,
      session: {
        session_id: sessionId,
        status: sessionData.status_enum,
      },
    })
  } catch (error) {
    console.error('Error fetching Devin session:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/issues/[id] - Execute the action plan from an existing Devin session
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { issue, action_plan } = body

    if (!issue.number) {
      return NextResponse.json(
        { success: false, error: 'Issue is required' },
        { status: 400 }
      )
    }

    const DEVIN_API_KEY = process.env.DEVIN_API_KEY;
    const prompt = `
      Resolve the following issue on the Github repo issues_dashboard.
      <issue_details>
      Title: ${issue.title}
      Issue number: ${issue.number}
      </issue_details>

      Here is the action plan you came up with previously to resolve this issue. Follow this plan to solve this issue.
      <action_plan>
      ${action_plan}
      </action_plan>

      While adhering to the plan above, the following steps must be followed as well.
      1. Comment on the issue directly that you will resolve it and the plan you will follow
      2. Create a new branch to work on the fix
      3. Create a PR once you have validated your changes work and the issue has been solved.
      4. Respond in your output here with a brief summary of what you did. Return this in your output as execution_summary.
      
      NOTE: DO NOT automerge the PR. This will be done manually by a human. 
    `
    // Create a new Devin session
    const devinResponse = await fetch('https://api.devin.ai/v1/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEVIN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        title: `Executing on Action Plan for Issue ${issue.number}`
      }),
    })

    if (!devinResponse.ok) {
      const errorText = await devinResponse.text()
      console.error('Devin API error:', errorText)
      throw new Error(`Devin API responded with status: ${devinResponse.status}`)
    }

    const sessionData = await devinResponse.json()
    const sessionId = sessionData.session_id

    const POLL_INTERVAL = 10000 // 10 seconds
    const MAX_POLL_TIME = 600000 // 10 minutes max
    const maxPolls = MAX_POLL_TIME / POLL_INTERVAL

    let hasStructuredOutput = false;
    let devinSummary = '';
    let pollCount = 0;
    let pollResponse;

    while(!hasStructuredOutput && pollCount < maxPolls) {
      // Wait before polling
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL))
      pollCount++

      console.log(`Polling session (attempt ${pollCount})...`)

      // Fetch session status
      const statusResponse = await fetch(
        `https://api.devin.ai/v1/sessions/${sessionId}`,
        {
          headers: {
            'Authorization': `Bearer ${DEVIN_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!statusResponse.ok) {
        console.error(`Failed to fetch session status: ${statusResponse.status}`)
        break
      }

      pollResponse = await statusResponse.json()

      if (pollResponse.structured_output) {
        hasStructuredOutput = true
      }
    }

    if(hasStructuredOutput) {
      console.log(`Devin Finished executing`);
      devinSummary = pollResponse.structured_output.execution_summary
    }
    else if (pollCount >= maxPolls) {
      throw new Error(`Timeout exceeded`)
    }


    return NextResponse.json({
      success: true,
      summary: devinSummary,
      session_id: sessionId
    })
  } catch (error) {
    console.error('Error executing plan:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/issues/[id] - Handle "Fix with Devin" action
export async function POST(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { issue } = body

    console.log(`Fix with Devin triggered for issue #${id}`)
    console.log('Issue metadata:', issue)

    const DEVIN_API_KEY = process.env.DEVIN_API_KEY

    const prompt = `
      Create an action plan to solve the following issue on the issues_dashboard repository.
      <issue_details>
      Issue Title: ${issue.title}
      Issue #${issue.number}
      Issue ID: ${issue.id}
      URL: ${issue.html_url}
      </issue_details>

      You have access to look up the issue details yourself, but here is the issue description for reference:
      <issue_body>
      ${issue.body}
      </issue_body>

      Come up with an action plan to resolve the issue. Then, come up with a confidence score (1-100) regarding this plan. Return the action_plan and confidence_score in your output.
      
      Do not ask the user for confirmation or follow ups when you execute this task. The user will not be able to interact with you directly. Note: do not actually proceed with solving the issue. The user is only interested in a plan and confidence score.
    `.trim()

    console.log('Creating Devin session with prompt:', prompt)

    // Create a new Devin session
    const devinResponse = await fetch('https://api.devin.ai/v1/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEVIN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        title: `Action Plan for Issue #${issue.number}`
      }),
    })

    if (!devinResponse.ok) {
      const errorText = await devinResponse.text()
      console.error('Devin API error:', errorText)
      throw new Error(`Devin API responded with status: ${devinResponse.status}`)
    }

    const sessionData = await devinResponse.json()
    console.log('Devin session created:', sessionData)

    const sessionId = sessionData.session_id
    console.log(`Session ID: ${sessionId}`)

    const POLL_INTERVAL = 10000 // 10 seconds
    const MAX_POLL_TIME = 300000 // 5 minutes max

    const devinAction = {
      plan: '',
      confidence: 0
    }
    let pollCount = 0
    const maxPolls = MAX_POLL_TIME / POLL_INTERVAL
    let hasStructuredOutput = false
    let latestStatusData = null

    // Poll the session for updates until structured_output is available
    while (!hasStructuredOutput && pollCount < maxPolls) {
      // Wait before polling
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL))
      pollCount++

      console.log(`Polling session (attempt ${pollCount})...`)

      // Fetch session status
      const statusResponse = await fetch(
        `https://api.devin.ai/v1/sessions/${sessionId}`,
        {
          headers: {
            'Authorization': `Bearer ${DEVIN_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!statusResponse.ok) {
        console.error(`Failed to fetch session status: ${statusResponse.status}`)
        break
      }

      latestStatusData = await statusResponse.json()

      console.log(`Current status: ${latestStatusData.status_enum}`)
      console.log('Session update:', JSON.stringify(latestStatusData, null, 2))

      // Check if structured_output is available
      if (latestStatusData.structured_output) {
        hasStructuredOutput = true
      }
    }

    // Parse structured output if available
    if (hasStructuredOutput) {
      console.log(`✅ Structured output received`)
      devinAction.plan = latestStatusData.structured_output.action_plan
      devinAction.confidence = latestStatusData.structured_output.confidence_score
    } else if (pollCount >= maxPolls) {
      throw new Error(`Timeout exceeded`)
    }

    return NextResponse.json({
      success: true,
      message: {
        ...devinAction
      },
      session: {
        session_id: sessionId,
        poll_count: pollCount,
      },
    })
  } catch (error) {
    console.error('Error in Fix with Devin:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
