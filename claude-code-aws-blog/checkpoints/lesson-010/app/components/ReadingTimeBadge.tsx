interface ReadingTimeBadgeProps {
  minutes: number;
}

/**
 * ReadingTimeBadge component displays estimated reading time
 * Styled to match category badge with AWS Orange theme
 * Server component - no client JavaScript required
 */
export default function ReadingTimeBadge({ minutes }: ReadingTimeBadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        backgroundColor: '#FF9900',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '1.5rem',
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      {minutes} min read
    </span>
  );
}
