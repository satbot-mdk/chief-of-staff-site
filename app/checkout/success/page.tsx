'use client'

import { useCheckoutSuccess } from '@moneydevkit/nextjs'
import Link from 'next/link'

export default function SuccessPage() {
  const { isCheckoutPaidLoading, isCheckoutPaid } = useCheckoutSuccess()

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

        <div className="sketch-card" style={{ padding: '28px 28px 32px', marginBottom: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: 6 }}>1. Download</p>
              <a
                href="https://github.com/moneydevkit/clawdbot-chief-of-staff-kit/archive/refs/heads/main.zip"
                className="btn-primary"
                style={{
                  display: 'inline-block',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  padding: '10px 24px',
                }}
              >
                Download the kit (.zip)
              </a>
            </div>

            <div>
              <p style={{ fontWeight: 600, marginBottom: 6 }}>2. Copy to your workspace</p>
              <code style={{
                display: 'block',
                background: 'rgba(44, 36, 22, 0.06)',
                padding: '12px 16px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontFamily: 'ui-monospace, monospace',
                color: 'var(--ink)',
              }}>
                cp SOUL.md AGENTS.md HEARTBEAT.md TOOLS.md ~/clawd/
              </code>
            </div>

            <div>
              <p style={{ fontWeight: 600, marginBottom: 6 }}>3. Make it yours</p>
              <p style={{ color: 'rgba(44, 36, 22, 0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Open SOUL.md — replace <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.85em' }}>[YOUR_NAME]</code> and{' '}
                <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.85em' }}>[YOUR_TIMEZONE]</code>.
              </p>
            </div>

            <div>
              <p style={{ fontWeight: 600, marginBottom: 6 }}>4. Go</p>
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
