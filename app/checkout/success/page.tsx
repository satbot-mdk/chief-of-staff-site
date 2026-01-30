'use client'

import { useCheckoutSuccess } from '@moneydevkit/nextjs'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function SuccessPage() {
  const { isCheckoutPaidLoading, isCheckoutPaid, metadata } = useCheckoutSuccess()
  const [fulfillState, setFulfillState] = useState<'idle' | 'loading' | 'success' | 'already' | 'error'>('idle')
  const [fulfillError, setFulfillError] = useState<string | null>(null)
  const [githubUsername, setGithubUsername] = useState<string | null>(null)

  useEffect(() => {
    if (!isCheckoutPaid || fulfillState !== 'idle') return

    const params = new URLSearchParams(window.location.search)
    const checkoutId = params.get('checkout-id')
    if (!checkoutId) {
      setFulfillError('Missing checkout reference.')
      setFulfillState('error')
      return
    }

    setFulfillState('loading')
    fetch('/api/fulfill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkoutId }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (res.ok) {
          setGithubUsername(data.githubUsername)
          setFulfillState(data.alreadyCollaborator ? 'already' : 'success')
        } else {
          setFulfillError(data.error || 'Something went wrong')
          setFulfillState('error')
        }
      })
      .catch(() => {
        setFulfillError('Network error — try refreshing.')
        setFulfillState('error')
      })
  }, [isCheckoutPaid, fulfillState])

  if (isCheckoutPaidLoading || isCheckoutPaid === null) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--cream)',
      }}>
        <p style={{ color: 'var(--warm)', fontSize: '1.1rem', fontStyle: 'italic' }}>
          Checking your payment…
        </p>
      </div>
    )
  }

  if (!isCheckoutPaid) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--cream)',
        padding: 24,
      }}>
        <div style={{ maxWidth: 420, textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: 12 }}>
            Payment not confirmed
          </h1>
          <p style={{ color: 'rgba(44, 36, 22, 0.6)', marginBottom: 24, lineHeight: 1.6 }}>
            We couldn&apos;t verify the payment. If you think this is wrong, try again.
          </p>
          <Link
            href="/"
            className="btn-primary"
            style={{ display: 'inline-block', textDecoration: 'none' }}
          >
            Back home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--cream)',
      padding: 24,
    }}>
      <div style={{ maxWidth: 560 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--sage)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            You&apos;re in
          </p>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 400,
            marginBottom: 8,
          }}>
            Welcome to the kit.
          </h1>
          <p style={{ color: 'rgba(44, 36, 22, 0.55)', fontSize: '1rem' }}>
            Payment confirmed. Here&apos;s everything you need.
          </p>
        </div>

        {/* Repo access status */}
        <div className="sketch-card" style={{ padding: '22px 24px', marginBottom: 24 }}>
          {fulfillState === 'loading' && (
            <p style={{ color: 'var(--warm)', fontStyle: 'italic' }}>
              🔑 Setting up your repo access…
            </p>
          )}
          {fulfillState === 'success' && (
            <div>
              <p style={{ fontWeight: 600, marginBottom: 6, color: 'var(--sage)' }}>
                ✅ Repo invite sent!
              </p>
              <p style={{ color: 'rgba(44, 36, 22, 0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Check your GitHub notifications — we sent a collaborator invite to{' '}
                <strong>@{githubUsername}</strong> for the private{' '}
                <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.85em' }}>chief-of-staff-kit</code>{' '}
                repo. Accept it to get access.
              </p>
              <a
                href="https://github.com/notifications"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: 12,
                  color: 'var(--warm)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }}
              >
                Open GitHub notifications →
              </a>
            </div>
          )}
          {fulfillState === 'already' && (
            <div>
              <p style={{ fontWeight: 600, marginBottom: 6, color: 'var(--sage)' }}>
                ✅ You already have access!
              </p>
              <p style={{ color: 'rgba(44, 36, 22, 0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                <strong>@{githubUsername}</strong> is already a collaborator on the repo. You&apos;re good to go.
              </p>
              <a
                href={`https://github.com/satbot-mdk/chief-of-staff-kit`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: 12,
                  color: 'var(--warm)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }}
              >
                Go to the repo →
              </a>
            </div>
          )}
          {fulfillState === 'error' && (
            <div>
              <p style={{ fontWeight: 600, marginBottom: 6, color: 'var(--rose)' }}>
                ⚠️ Couldn&apos;t set up repo access
              </p>
              <p style={{ color: 'rgba(44, 36, 22, 0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {fulfillError}
              </p>
              <p style={{ color: 'rgba(44, 36, 22, 0.5)', fontSize: '0.85rem', marginTop: 8, fontStyle: 'italic' }}>
                Don&apos;t worry — your payment went through. Reach out on{' '}
                <a href="https://discord.com/invite/clawd" style={{ color: 'var(--warm)' }}>Discord</a>{' '}
                and we&apos;ll sort it out.
              </p>
            </div>
          )}
        </div>

        {/* Setup instructions */}
        <div className="sketch-card" style={{ padding: '28px 28px 32px', marginBottom: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: 6 }}>1. Accept the invite</p>
              <p style={{ color: 'rgba(44, 36, 22, 0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Check your{' '}
                <a href="https://github.com/notifications" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--warm)', textDecoration: 'none' }}>
                  GitHub notifications
                </a>{' '}
                and accept the collaborator invite.
              </p>
            </div>

            <div>
              <p style={{ fontWeight: 600, marginBottom: 6 }}>2. Clone the repo</p>
              <code style={{
                display: 'block',
                background: 'rgba(44, 36, 22, 0.06)',
                padding: '12px 16px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontFamily: 'ui-monospace, monospace',
                color: 'var(--ink)',
              }}>
                git clone https://github.com/satbot-mdk/chief-of-staff-kit.git
              </code>
            </div>

            <div>
              <p style={{ fontWeight: 600, marginBottom: 6 }}>3. Copy to your workspace</p>
              <code style={{
                display: 'block',
                background: 'rgba(44, 36, 22, 0.06)',
                padding: '12px 16px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontFamily: 'ui-monospace, monospace',
                color: 'var(--ink)',
              }}>
                cp chief-of-staff-kit/*.md ~/clawd/
              </code>
            </div>

            <div>
              <p style={{ fontWeight: 600, marginBottom: 6 }}>4. Make it yours</p>
              <p style={{ color: 'rgba(44, 36, 22, 0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Open SOUL.md — replace <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.85em' }}>[YOUR_NAME]</code> and{' '}
                <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.85em' }}>[YOUR_TIMEZONE]</code>.
              </p>
            </div>

            <div>
              <p style={{ fontWeight: 600, marginBottom: 6 }}>5. Go</p>
              <code style={{
                display: 'block',
                background: 'rgba(44, 36, 22, 0.06)',
                padding: '12px 16px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontFamily: 'ui-monospace, monospace',
                color: 'var(--ink)',
                marginBottom: 8,
              }}>
                clawdbot gateway
              </code>
              <p style={{ color: 'rgba(44, 36, 22, 0.5)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                Try: &quot;What&apos;s on my plate today?&quot;
              </p>
            </div>
          </div>
        </div>

        <p style={{
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'rgba(44, 36, 22, 0.5)',
          marginBottom: 8,
        }}>
          You also get future updates — just <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.85em' }}>git pull</code> anytime.
        </p>

        <p style={{
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'rgba(44, 36, 22, 0.4)',
        }}>
          Need help?{' '}
          <a href="https://docs.clawd.bot" style={{ color: 'var(--warm)', textDecoration: 'none' }}>Docs</a>
          {' · '}
          <a href="https://discord.com/invite/clawd" style={{ color: 'var(--warm)', textDecoration: 'none' }}>Discord</a>
        </p>
      </div>
    </div>
  )
}
