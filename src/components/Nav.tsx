import { useApp } from '../store/app'

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

const iconBtn =
  'brutal-lift w-9.5 h-9.5 sm:w-10.5 sm:h-10.5 flex items-center justify-center text-ink bg-paper border-[3px] border-ink shadow-brutal-sm hover:shadow-brutal-md'

export function Nav() {
  const { openCart, openAccount, count } = useApp()

  return (
    <nav className="fixed top-5 left-5 right-5 sm:top-7 sm:left-7 sm:right-7 lg:top-10 lg:left-10 lg:right-10 h-13 sm:h-15 flex items-center justify-between z-60 gap-3">
      <a href="#products" className="flex items-center gap-2.5 bg-ink text-paper px-2.5 py-1.5 sm:px-3 sm:py-2 border-[3px] border-ink shadow-brutal-sm shrink-0 hover:shadow-brutal-md transition-shadow">
        <div className="logo-mark" aria-hidden="true" />
        <div className="font-display text-sm sm:text-base tracking-[0.02em] leading-[0.95] uppercase text-paper">
          SLAM
          <br />
          DUNK
        </div>
      </a>

      <div className="hidden lg:flex gap-1 bg-paper border-[3px] border-ink p-1.25 shadow-brutal-sm">
        <NavLink href="#products" label="Products" active />
        <NavLink href="#customize" label="Customize" />
        <NavLink href="#contacts" label="Contacts" />
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <button
          type="button"
          aria-label="Account"
          onClick={openAccount}
          className={iconBtn}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          </svg>
        </button>
        <button
          type="button"
          aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
          onClick={openCart}
          className={`${iconBtn} relative`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 8h14l-1.5 12.5a1 1 0 0 1-1 .9H7.5a1 1 0 0 1-1-.9L5 8Z" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
          {count > 0 && (
            <span className="absolute -top-2.5 -right-2.5 min-w-5.5 h-5.5 px-1.5 rounded-full bg-accent text-ink font-display text-[11px] border-2 border-ink flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}
