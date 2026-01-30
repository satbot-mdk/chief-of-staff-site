import { NextRequest, NextResponse } from 'next/server'

const GITHUB_PAT = process.env.GITHUB_PAT!
const REPO_OWNER = 'satbot-mdk'
const REPO_NAME = 'chief-of-staff-kit'

async function inviteCollaborator(username: string): Promise<{ ok: boolean; status: number; message: string }> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/collaborators/${encodeURIComponent(username)}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_PAT}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({ permission: 'pull' }),
    }
  )

  if (res.status === 201) {
    return { ok: true, status: 201, message: 'Invitation sent' }
  }
  if (res.status === 204) {
    return { ok: true, status: 204, message: 'Already a collaborator' }
  }

  const body = await res.text()
  return { ok: false, status: res.status, message: body }
}

export async function POST(req: NextRequest) {
  try {
    const { checkoutId } = await req.json()

    if (!checkoutId) {
      return NextResponse.json({ error: 'Missing checkoutId' }, { status: 400 })
    }

    // Verify payment via MDK API
    const mdkApiKey = process.env.MDK_ACCESS_TOKEN
    if (!mdkApiKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const checkoutRes = await fetch(`https://api.moneydevkit.com/v1/checkouts/${checkoutId}`, {
      headers: {
        Authorization: `Bearer ${mdkApiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!checkoutRes.ok) {
      return NextResponse.json({ error: 'Could not verify checkout' }, { status: 400 })
    }

    const checkout = await checkoutRes.json()

    // Check payment is actually complete
    if (checkout.status !== 'PAID' && checkout.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Payment not confirmed yet' }, { status: 402 })
    }

    // Extract GitHub username from metadata
    const githubUsername = checkout.metadata?.githubUsername
    if (!githubUsername) {
      return NextResponse.json({ error: 'No GitHub username in checkout' }, { status: 400 })
    }

    // Invite as collaborator
    const result = await inviteCollaborator(githubUsername)

    if (!result.ok) {
      console.error(`GitHub invite failed for ${githubUsername}:`, result)
      return NextResponse.json(
        { error: `Could not invite ${githubUsername}. Check the username is correct.`, detail: result.message },
        { status: 422 }
      )
    }

    return NextResponse.json({
      success: true,
      githubUsername,
      message: result.message,
      alreadyCollaborator: result.status === 204,
    })
  } catch (err) {
    console.error('Fulfill error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
