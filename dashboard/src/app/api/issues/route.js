import { NextResponse } from 'next/server'

// GET /api/issues - Fetch all issues
export async function GET(request) {
  try {
    // TODO: Add your server-side logic here
    // Example: Fetch from database, external API, etc.

    return NextResponse.json({
      success: true,
      data: []
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
