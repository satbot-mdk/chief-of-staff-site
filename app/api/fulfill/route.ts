import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_PAT || ''
const REPO_OWNER = 'satbot-mdk'
const REPO_NAME = 'chief-of-staff-kit'

export async function POST(req: NextRequest) {
  try {
    const { checkoutId, githubUsername } = await req.json()

    if (!checkoutId || !githubUsername) {
      return NextResponse.json(
        { error: 'Missing checkoutId or githubUsername' },
        { status: 400 }
      )
    }

    // Sanitize GitHub username
    const username = String(githubUsername).trim().replace(/^@/, '')
    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(username)) {
      return NextResponse.json(
        { error: 'Invalid GitHub username format.' },
        { status: 400 }
      )
    }

    // Check if already a collaborator
    const checkRes = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/collaborators/${username}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
        },
      }
    )

    if (checkRes.status === 204) {
      return NextResponse.json({
        success: true,
        alreadyCollaborator: true,
        githubUsername: username,
      })
    }

    // Send collaborator invite (read-only access)
    const inviteRes = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/collaborators/${username}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
        },
        body: JSON.stringify({ permission: 'pull' }),
      }
    )

    if (!inviteRes.ok) {
      const errData = await inviteRes.json().catch(() => ({}))
      console.error('GitHub invite failed:', inviteRes.status, errData)

      if (inviteRes.status === 404) {
        return NextResponse.json({
          error: `GitHub user "${username}" not found. Double-check the username.`,
        }, { status: 400 })
      }

      if (inviteRes.status === 422) {
        // Usually means validation failed (e.g. can't invite yourself)
        return NextResponse.json({
          success: true,
          alreadyCollaborator: true,
          githubUsername: username,
        })
      }

      return NextResponse.json({
        error: 'Failed to send GitHub invite. Please contact support.',
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      alreadyCollaborator: false,
      githubUsername: username,
    })
  } catch (err) {
    console.error('Fulfill error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
