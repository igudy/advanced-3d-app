export function Nav() {
  return (
    <nav className="nav">
      <div className="logo">
        <div className="logo-mark" aria-hidden="true" />
        <div className="logo-text">
          SLAM
          <br />
          DUNK
        </div>
      </div>

      <div className="nav-links">
        <a href="#products" className="nav-link active">Products</a>
        <a href="#customize" className="nav-link">Customize</a>
        <a href="#contacts" className="nav-link">Contacts</a>
      </div>

      <div className="nav-actions">
        <button className="icon-btn" aria-label="Account">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          </svg>
        </button>
        <button className="icon-btn" aria-label="Cart, 3 items">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 8h14l-1.5 12.5a1 1 0 0 1-1 .9H7.5a1 1 0 0 1-1-.9L5 8Z" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
          <span className="cart-badge">3</span>
        </button>
      </div>
    </nav>
  )
}
