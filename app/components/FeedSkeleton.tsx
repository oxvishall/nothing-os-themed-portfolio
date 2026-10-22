// Placeholder posts shown while feed data loads.
// Mirrors the real post layout so nothing jumps when content arrives.
export default function FeedSkeleton({ count = 3, media = true }: { count?: number; media?: boolean }) {
  return (
    <div className="feed-skeleton" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-post">
          <div className="skeleton-block skeleton-avatar" />
          <div className="skeleton-body">
            <div className="skeleton-block skeleton-line" style={{ width: '38%' }} />
            <div className="skeleton-block skeleton-line" style={{ width: '92%' }} />
            <div className="skeleton-block skeleton-line" style={{ width: '74%' }} />
            {media && <div className="skeleton-block skeleton-media" />}
          </div>
        </div>
      ))}
    </div>
  );
}
