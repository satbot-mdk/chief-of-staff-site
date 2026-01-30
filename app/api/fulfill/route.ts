import { NextRequest, NextResponse } from 'next/server'
import { createMoneyDevKitClient } from '@moneydevkit/core'

const GITHUB_TOKEN = process.env.GITHUB_PAT || ''
const REPO_OWNER = 'satbot-mdk'
const REPO_NAME = 'chief-of-staff-kit'

export async function POST(req: NextRequest) {
  try {
    const { checkoutId } = await req.json()

    if (!checkoutId) {
      return NextResponse.json({ error: 'Missing checkoutId' }, { status: 400 })
    }

    // 1. Verify checkout via MDK SDK
    const client = createMoneyDevKitClient()
    let checkout
    try {
      checkout = await client.checkouts.get({ id: checkoutId })
    } catch (err) {
      console.error('MDK getCheckout error:', err)
      return NextResponse.json({ error: 'Could not verify payment' }, { status: 400 })
    }

    if (!checkout) {
      return NextResponse.json({ error: 'Checkout not found' }, { status: 404 })
    }

    // Check payment status
    const invoiceSettled = ((checkout as any).invoice?.amountSatsReceived ?? 0) > 0
    const isPaid = checkout.status === 'PAYMENT_RECEIVED' || invoiceSettled

    if (!isPaid) {
      return NextResponse.json({ error: 'Payment not confirmed yet' }, { status: 402 })
    }

    // 2. Extract GitHub username from checkout metadata
    const githubUsername = (checkout as any).userMetadata?.githubUsername
    if (!githubUsername) {
      return NextResponse.json({ error: 'No GitHub username found in checkout' }, { status: 400 })
    }

    // 3. Check if already a collaborator
    const checkRes = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/collaborators/${githubUsername}`,
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
        githubUsername,
      })
    }

    // 4. Send collaborator invite
    const inviteRes = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/collaborators/${githubUsername}`,
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
          error: `GitHub user "${githubUsername}" not found. Double-check the username.`,
        }, { status: 400 })
      }

      return NextResponse.json({
        error: 'Failed to send GitHub invite. Please contact support.',
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      alreadyCollaborator: false,
      githubUsername,
    })
  } catch (err) {
    console.error('Fulfill error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
