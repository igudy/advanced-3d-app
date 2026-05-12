export function ProductFooter() {
  return (
    <div className="product-footer">
      <div className="price-block">
        <div className="price">$34.99</div>
        <div className="meta">
          Size: <strong>29.5"</strong> &nbsp;•&nbsp; Official
        </div>
        <div className="cut">Ru</div>
      </div>

      <button className="cta">Add to Cart</button>

      <div className="carousel">
        <button className="carousel-btn" aria-label="Previous">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <button className="carousel-btn" aria-label="Next">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
