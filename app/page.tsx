'use client'

import { useCheckout } from '@moneydevkit/nextjs'
import { useState } from 'react'

const personalities = [
  {
    id: 'base',
    name: 'The Professional',
    tagline: 'Clean. Direct. Gets it done.',
    desc: 'Sharp, concise executive assistant. No fluff, no filler. Professional warmth with occasional dry humor. The one your boss would approve of.',
    vibe: '"You have 3 urgent emails and a conflict at 2pm. Here\'s what I\'d do."',
    color: 'var(--sage)',
  },
  {
    id: 'quirk',
    name: 'The EA',
    tagline: 'Maximum personality. Still competent.',
    desc: 'Strong opinions about your calendar. Roasts your email habits with love. Gives your recurring meetings character arcs. Chaotic but deadly effective.',
    vibe: '"you have 3 meetings today, one of which is a crime against your calendar 💀"',
    color: 'var(--rose)',
  },
  {
    id: 'eigen',
    name: 'The TPOT',
    tagline: 'terse. smart. straussian.',
    desc: 'Inspired by eigenrobot\'s famous custom instructions. All lowercase, abbreviations everywhere, +2sd smarter, esoteric references. For people who find normal AI insufferably verbose.',
    vibe: '"3 urgent emails rn. the calendar is mid tbh. idk why you agreed to that 4pm but here we are"',
    color: 'var(--warm)',
  },
]

export default function HomePage() {
  const { createCheckout, isLoading } = useCheckout()
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState('base')
  const [githubUsername, setGithubUsername] = useState('')

  const handlePurchase = async () => {
    setError(null)
    if (!githubUsername.trim()) {
      setError('GitHub username is required — we need it to grant you repo access.')
      return
    }
    const result = await createCheckout({
      type: 'AMOUNT',
      title: 'Chief of Staff Starter Kit',
      description: `Pre-configured Clawdbot workspace — daily briefings, email triage, smart follow-ups. Personality: ${selected}`,
      amount: 150,
      currency: 'USD',
      successUrl: '/checkout/success',
      metadata: {
        product: 'chief-of-staff-starter-kit',
        version: '1.0.0',
        personality: selected,
        githubUsername: githubUsername.trim(),
      }
    })
    if (result.error) {
      setError(result.error.message)
      return
    }
    window.location.href = result.data.checkoutUrl
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>

      {/* Nav */}
      <nav style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '28px 24px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        opacity: 0.6,
        fontSize: '0.85rem',
      }}>
        <span>moneydevkit</span>
        <a href="https://docs.clawd.bot" style={{ color: 'var(--warm)', textDecoration: 'none' }}>
          docs ↗
        </a>
      </nav>

      {/* Hero */}
      <header style={{
        maxWidth: 620,
        margin: '0 auto',
        padding: '80px 24px 60px',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--warm)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 20,
        }}>
          For Clawdbot &amp; Moltbot
        </p>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 400,
          lineHeight: 1.2,
          marginBottom: 24,
          letterSpacing: '-0.01em',
        }}>
          Your agent is&nbsp;installed.
          <br />
          <em style={{ fontStyle: 'italic', color: 'var(--sage)' }}>
            Now give it a&nbsp;purpose.
          </em>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'rgba(44, 36, 22, 0.65)',
          lineHeight: 1.7,
          maxWidth: 480,
          margin: '0 auto 40px',
        }}>
          The Chief of Staff Kit is a hand-tuned workspace that turns
          your Clawdbot into a daily briefer, email triager, and
          follow-up tracker. Five minutes to set up. Runs on pennies.
        </p>

        <div style={{
          maxWidth: 320,
          margin: '0 auto 20px',
          textAlign: 'left',
        }}>
          <label style={{
            display: 'block',
            fontSize: '0.85rem',
            color: 'rgba(44, 36, 22, 0.6)',
            marginBottom: 6,
            fontWeight: 500,
          }}>
            GitHub username
          </label>
          <input
            type="text"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            placeholder="octocat"
            style={{
              width: '100%',
              padding: '10px 14px',
              fontSize: '1rem',
              fontFamily: 'ui-monospace, monospace',
              border: '1.5px solid rgba(44, 36, 22, 0.15)',
              borderRadius: '8px',
              background: 'var(--paper)',
              color: 'var(--ink)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <p style={{
            fontSize: '0.78rem',
            color: 'rgba(44, 36, 22, 0.4)',
            marginTop: 6,
            fontStyle: 'italic',
          }}>
            After payment, you&apos;ll get a collaborator invite to the private repo.
          </p>
        </div>

        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className="btn-primary"
        >
          {isLoading ? 'One moment…' : 'Get the kit — $1.50'}
        </button>

        {error && (
          <p style={{ color: 'var(--rose)', marginTop: 12, fontSize: '0.9rem' }}>{error}</p>
        )}

        <p style={{
          marginTop: 16,
          fontSize: '0.8rem',
          color: 'rgba(44, 36, 22, 0.4)',
        }}>
          One-time purchase · Repo access included · Lightning&nbsp;⚡
        </p>
      </header>

      <div className="divider-wave" />

      {/* Choose your personality */}
      <section style={{
        maxWidth: 820,
        margin: '0 auto',
        padding: '60px 24px',
      }}>
        <h2 style={{
          fontSize: '1.6rem',
          fontWeight: 400,
          textAlign: 'center',
          marginBottom: 8,
        }}>
          Choose your personality
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'rgba(44, 36, 22, 0.5)',
          marginBottom: 36,
          fontSize: '0.95rem',
        }}>
          Same capabilities. Different vibes. Pick the one that fits.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
        }}>
          {personalities.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              style={{
                background: selected === p.id ? 'var(--paper)' : 'transparent',
                border: selected === p.id ? '2px solid var(--ink)' : '1.5px solid rgba(44, 36, 22, 0.12)',
                borderRadius: selected === p.id ? '12px 4px 12px 4px' : '8px 3px 8px 3px',
                padding: '22px 20px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: selected === p.id ? 'rotate(-0.3deg)' : 'none',
                boxShadow: selected === p.id ? '3px 4px 0 rgba(44, 36, 22, 0.1)' : 'none',
                fontFamily: 'inherit',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 6,
              }}>
                <span style={{
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  color: 'var(--ink)',
                }}>
                  {p.name}
                </span>
                {selected === p.id && (
                  <span style={{ fontSize: '0.75rem', color: p.color, fontWeight: 500 }}>
                    selected
                  </span>
                )}
              </div>
              <div style={{
                fontSize: '0.82rem',
                color: p.color,
                fontStyle: 'italic',
                marginBottom: 10,
              }}>
                {p.tagline}
              </div>
              <p style={{
                fontSize: '0.88rem',
                color: 'rgba(44, 36, 22, 0.6)',
                lineHeight: 1.55,
                marginBottom: 12,
              }}>
                {p.desc}
              </p>
              <p style={{
                fontSize: '0.82rem',
                color: 'rgba(44, 36, 22, 0.4)',
                fontStyle: 'italic',
                lineHeight: 1.5,
                borderTop: '1px solid rgba(44, 36, 22, 0.08)',
                paddingTop: 10,
              }}>
                {p.vibe}
              </p>
            </button>
          ))}
        </div>
      </section>

      <div className="divider-wave" />

      {/* What's in the kit */}
      <section style={{
        maxWidth: 620,
        margin: '0 auto',
        padding: '60px 24px',
      }}>
        <h2 style={{
          fontSize: '1.6rem',
          fontWeight: 400,
          textAlign: 'center',
          marginBottom: 8,
        }}>
          What&apos;s in the kit
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'rgba(44, 36, 22, 0.5)',
          marginBottom: 40,
          fontSize: '0.95rem',
        }}>
          Six files. Drop them in your workspace. That&apos;s it.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { name: 'SOUL.md ×3', note: 'Three personalities to choose from. Swap anytime — it\'s just a file.' },
            { name: 'AGENTS.md', note: 'The rules of the house. Memory, safety, when to speak and when to stay quiet.' },
            { name: 'HEARTBEAT.md', note: 'A day-planner for your agent. Morning briefing, midday scan, evening wrap. Batched so it doesn\'t drain your wallet.' },
            { name: 'cron-jobs.json', note: 'Three schedules, ready to go. Weekday briefing at 8am, weekends at 9, follow-ups at 2pm.' },
            { name: 'TOOLS.md', note: 'A blank canvas for your setup — channels, email, calendar, voice. Fill it in once.' },
            { name: 'README.md', note: 'The whole setup, start to finish. Five minutes, two fields to customize, done.' },
          ].map((item, i) => (
            <div key={i} className="sketch-card" style={{ padding: '18px 22px' }}>
              <span style={{
                fontWeight: 600,
                fontSize: '0.95rem',
                color: 'var(--ink)',
              }}>
                {item.name}
              </span>
              <span style={{
                display: 'inline',
                marginLeft: 8,
                fontSize: '0.9rem',
                color: 'rgba(44, 36, 22, 0.55)',
                fontStyle: 'italic',
              }}>
                — {item.note}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="divider-wave" />

      {/* What it does */}
      <section style={{
        maxWidth: 620,
        margin: '0 auto',
        padding: '60px 24px',
      }}>
        <h2 style={{
          fontSize: '1.6rem',
          fontWeight: 400,
          textAlign: 'center',
          marginBottom: 40,
        }}>
          What your agent will&nbsp;do
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 28,
        }}>
          {[
            { title: 'Morning briefing', body: 'Calendar, urgent emails, weather, due follow-ups. Under 200 words. Every day.' },
            { title: 'Email triage', body: 'Inbox sorted into urgent, respond, FYI, and skip. You only see what matters.' },
            { title: 'Follow-up tracking', body: '"Remind me to check in with Sarah on Thursday." Tracked. Reminded. Done.' },
            { title: 'Research on tap', body: 'Ask it to look something up. Get 3–5 bullet points with sources, not a novel.' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '0 4px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 6 }}>{item.title}</h3>
              <p style={{ fontSize: '0.92rem', color: 'rgba(44, 36, 22, 0.6)', lineHeight: 1.6 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider-wave" />

      {/* Token costs */}
      <section style={{
        maxWidth: 520,
        margin: '0 auto',
        padding: '60px 24px',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--sage)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 16,
        }}>
          On token costs
        </p>
        <p style={{
          fontSize: '1.15rem',
          lineHeight: 1.7,
          color: 'rgba(44, 36, 22, 0.7)',
        }}>
          The number one complaint in the community is cost.
          This kit is built lean on purpose — batched heartbeats
          instead of constant polling, concise prompts, no bloated
          context windows. Your agent does more while burning less.
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 40,
          marginTop: 32,
          fontSize: '0.85rem',
          color: 'rgba(44, 36, 22, 0.45)',
        }}>
          <div>
            <div style={{ fontSize: '1.4rem', color: 'var(--sage)', fontWeight: 500 }}>~1 KB</div>
            <div>soul overhead</div>
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', color: 'var(--sage)', fontWeight: 500 }}>2–4×</div>
            <div>heartbeats / day</div>
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', color: 'var(--sage)', fontWeight: 500 }}>5 min</div>
            <div>to set up</div>
          </div>
        </div>
      </section>

      <div className="divider-wave" />

      {/* Final CTA */}
      <section style={{
        maxWidth: 520,
        margin: '0 auto',
        padding: '60px 24px 40px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 400,
          marginBottom: 16,
        }}>
          Stop tinkering.<br />
          <em style={{ fontStyle: 'italic' }}>Start using.</em>
        </h2>
        <p style={{
          color: 'rgba(44, 36, 22, 0.55)',
          marginBottom: 28,
          fontSize: '0.95rem',
        }}>
          Three personalities. Five minutes. Your agent goes from idle to&nbsp;indispensable.
        </p>
        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className="btn-primary"
        >
          {isLoading ? 'One moment…' : 'Get the kit — $1.50'}
        </button>
        <p style={{
          marginTop: 16,
          fontSize: '0.78rem',
          color: 'rgba(44, 36, 22, 0.35)',
        }}>
          Powered by{' '}
          <a href="https://moneydevkit.com" style={{ color: 'var(--warm)', textDecoration: 'none' }}>
            moneydevkit
          </a>
          {' '}· Pay with Lightning ⚡
        </p>
      </section>

      {/* Footer */}
      <footer style={{
        maxWidth: 620,
        margin: '0 auto',
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
        fontSize: '0.8rem',
        color: 'rgba(44, 36, 22, 0.35)',
        borderTop: '1px solid rgba(44, 36, 22, 0.08)',
      }}>
        <a href="https://docs.clawd.bot" style={{ color: 'inherit', textDecoration: 'none' }}>Docs</a>
        <a href="https://github.com/clawdbot/clawdbot" style={{ color: 'inherit', textDecoration: 'none' }}>GitHub</a>
        <a href="https://discord.com/invite/clawd" style={{ color: 'inherit', textDecoration: 'none' }}>Discord</a>
      </footer>
    </div>
  )
}
