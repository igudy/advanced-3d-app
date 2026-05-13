import { useTheme } from '../theme/ThemeProvider'

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
  const { night, toggle } = useTheme()

  return (
    <nav className="fixed top-5 left-5 right-5 sm:top-7 sm:left-7 sm:right-7 lg:top-10 lg:left-10 lg:right-10 h-13 sm:h-15 flex items-center justify-between z-60 gap-2 sm:gap-3">
      <a
        href="#top"
        className="flex items-center gap-2.5 bg-ink text-paper px-2.5 py-1.5 sm:px-3 sm:py-2 border-[3px] border-ink shadow-brutal-sm shrink-0 hover:shadow-brutal-md transition-shadow pointer-events-auto"
      >
        <div className="logo-mark" aria-hidden="true" />
        <div className="font-display text-sm sm:text-base tracking-[0.02em] leading-[0.95] uppercase text-paper">
          THE
          <br />
          GREATS
        </div>
      </a>

      <div className="hidden lg:flex gap-1 bg-paper border-[3px] border-ink p-1.25 shadow-brutal-sm pointer-events-auto">
        <NavLink href="#football-prelude" label="Football" />
        <NavLink href="#basketball-prelude" label="Basketball" />
        <NavLink href="#tennis-prelude" label="Tennis" />
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={night}
          title={night ? 'Switch to day' : 'Switch to night'}
          className="brutal-lift h-9.5 sm:h-10.5 min-w-9.5 sm:min-w-10.5 px-2 border-[3px] border-ink bg-paper text-ink font-display text-[10px] sm:text-[11px] tracking-[0.12em] uppercase shadow-brutal-sm hover:shadow-brutal-md flex items-center justify-center pointer-events-auto"
        >
          {night ? 'Day' : 'Night'}
        </button>
        <a
          href="#the-greats"
          className="brutal-lift bg-accent text-ink font-display text-[11px] sm:text-xs tracking-[0.16em] uppercase border-[3px] border-ink shadow-brutal-sm hover:shadow-brutal-md px-3 sm:px-4 h-9.5 sm:h-10.5 flex items-center justify-center pointer-events-auto"
        >
          Hall of Fame ↓
        </a>
      </div>
    </nav>
  )
}
