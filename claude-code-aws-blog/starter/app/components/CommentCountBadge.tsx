'use client';

import { useState, useEffect } from 'react';

interface CommentCountBadgeProps {
  postId: string;
}

/**
 * CommentCountBadge displays the number of comments for a post
 * Client component - needs access to localStorage
 */
export default function CommentCountBadge({ postId }: CommentCountBadgeProps) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // Get initial count
    const updateCount = () => {
      const storageKey = `blog-comments-${postId}`;
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        try {
          const comments = JSON.parse(stored);
          setCount(comments.length);
        } catch (e) {
          setCount(0);
        }
      } else {
        setCount(0);
      }
    };

    updateCount();

    // Listen for comment updates
    const handleCommentsUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.postId === postId) {
        setCount(customEvent.detail.count);
      }
    };

    window.addEventListener('commentsUpdated', handleCommentsUpdate);

    return () => {
      window.removeEventListener('commentsUpdated', handleCommentsUpdate);
    };
  }, [postId]);

  return (
    <span className="comment-count-badge">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ display: 'inline-block', marginRight: '0.375rem' }}
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      {count} {count === 1 ? 'comment' : 'comments'}

      <style jsx>{`
        .comment-count-badge {
          display: inline-flex;
          align-items: center;
          background: var(--aws-blue);
          color: white;
          padding: 0.5rem 0.875rem;
          border-radius: 1.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
      `}</style>
    </span>
  );
}
