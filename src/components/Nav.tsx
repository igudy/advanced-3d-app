type LinkProps = { href: string; label: string; active?: boolean }

const linkBase =
  'font-ui font-bold text-xs tracking-[0.08em] uppercase px-3 py-[7px] border-2 transition-colors whitespace-nowrap'

function NavLink({ href, label, active }: LinkProps) {
  return active ? (
    <a href={href} className={`${linkBase} bg-ink text-accent border-ink`}>
      {label}
    </a>
  ) : (
    <a
      href={href}
      className={`${linkBase} text-ink border-transparent hover:border-ink`}
    >
      {label}
    </a>
  )
}

export function Nav() {
  return (
    <nav className="fixed top-5 left-5 right-5 sm:top-7 sm:left-7 sm:right-7 lg:top-10 lg:left-10 lg:right-10 h-13 sm:h-15 flex items-center justify-between z-60 gap-3">
      <a
        href="#top"
        className="flex items-center gap-2.5 bg-ink text-paper px-2.5 py-1.5 sm:px-3 sm:py-2 border-[3px] border-ink shadow-brutal-sm shrink-0 hover:shadow-brutal-md transition-shadow"
      >
        <div className="logo-mark" aria-hidden="true" />
        <div className="font-display text-sm sm:text-base tracking-[0.02em] leading-[0.95] uppercase text-paper">
          THE
          <br />
          GREATS
        </div>
      </a>

      <div className="hidden lg:flex gap-1 bg-paper border-[3px] border-ink p-1.25 shadow-brutal-sm">
        <NavLink href="#football-prelude" label="Football" />
        <NavLink href="#basketball-prelude" label="Basketball" />
        <NavLink href="#tennis-prelude" label="Tennis" />
      </div>

      <a
        href="#legends"
        className="brutal-lift bg-accent text-ink font-display text-[11px] sm:text-xs tracking-[0.16em] uppercase border-[3px] border-ink shadow-brutal-sm hover:shadow-brutal-md px-3 sm:px-4 h-9.5 sm:h-10.5 flex items-center justify-center shrink-0"
      >
        Hall of Fame ↓
      </a>
    </nav>
  )
}
