import { useState } from 'react'

const INFO = [
  { label: 'Email', value: 'hi@slamdunk.co', accent: false },
  { label: 'Phone', value: '+1 (419) 555-0142', accent: true },
  { label: 'HQ', value: 'Ada, OH · USA', accent: false },
]

export function Contacts() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setName('')
      setEmail('')
      setMessage('')
    }, 2400)
  }

  return (
    <section
      id="contacts"
      className="relative w-full min-h-screen px-5.5 sm:px-9 lg:px-16 pt-26 sm:pt-28 lg:pt-32 pb-14 sm:pb-16 grid lg:grid-cols-2 gap-8 lg:gap-15 items-start overflow-hidden scroll-mt-24"
    >
      {/* Heading column */}
      <div className="max-w-full w-full">
        <div className="eyebrow">05 / Contact</div>
        <h2 className="section-title">
          DROP A<br />
          LINE.
        </h2>
        <p className="font-ui font-medium text-[15px] lg:text-base xl:text-lg leading-[1.4] text-ink max-w-120 mt-2 mb-6">
          Wholesale, team orders, press, anything else.
          <br />
          We answer everything by next Tuesday.
        </p>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 max-w-120">
          {INFO.map((c) => (
            <div
              key={c.label}
              className={`brutal-lift ${c.accent ? 'bg-accent' : 'bg-paper'} border-4 border-ink p-3.5 shadow-brutal-sm hover:shadow-brutal-md`}
            >
              <div className="font-display text-[10px] tracking-[0.2em] uppercase text-ink opacity-70">
                {c.label}
              </div>
              <div className="font-display text-sm sm:text-[15px] text-ink mt-1 leading-tight break-words">
                {c.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form column */}
      <form
        onSubmit={onSubmit}
        className="lg:col-start-2 bg-paper border-4 border-ink p-5 sm:p-6 shadow-brutal-lg flex flex-col gap-4 w-full max-w-120 lg:justify-self-end"
      >
        <FormField label="Name">
          <input
            className="engrave-input normal-case! tracking-[0.04em]!"
            placeholder="First & Last"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={48}
            required
          />
        </FormField>

        <FormField label="Email">
          <input
            type="email"
            className="engrave-input normal-case! tracking-[0.04em]!"
            placeholder="you@team.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={64}
            required
          />
        </FormField>

        <FormField label="Message">
          <textarea
            className="engrave-input normal-case! tracking-[0.04em]! min-h-28 resize-none"
            placeholder="Tell us what you're after."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            required
          />
        </FormField>

        <button
          type="submit"
          disabled={sent}
          className="brutal-lift bg-ink text-accent font-display text-[13px] sm:text-[15px] tracking-[0.18em] uppercase border-4 border-ink shadow-brutal-lg hover:shadow-brutal-xl hover:bg-accent hover:text-ink flex items-center justify-center gap-2.5 w-full h-14 sm:h-15 disabled:opacity-100 disabled:cursor-default"
        >
          {sent ? 'Sent ✓' : 'Send Message →'}
        </button>
      </form>
    </section>
  )
}

function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-display text-[11px] tracking-[0.2em] uppercase text-ink">
        {label}
      </span>
      {children}
    </label>
  )
}
