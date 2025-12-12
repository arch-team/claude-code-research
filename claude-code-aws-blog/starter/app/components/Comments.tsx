'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: number;
}

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load comments from localStorage on mount
  useEffect(() => {
    const storageKey = `blog-comments-${postId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setComments(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse comments:', e);
      }
    }
  }, [postId]);

  // Save comments to localStorage whenever they change
  const saveComments = (newComments: Comment[]) => {
    const storageKey = `blog-comments-${postId}`;
    localStorage.setItem(storageKey, JSON.stringify(newComments));
    setComments(newComments);

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('commentsUpdated', {
      detail: { postId, count: newComments.length }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    const newComment: Comment = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      timestamp: Date.now(),
    };

    const updatedComments = [newComment, ...comments];
    saveComments(updatedComments);

    // Reset form
    setName('');
    setEmail('');
    setMessage('');
    setIsSubmitting(false);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="comments-section">
      <h2 className="comments-title">Comments ({comments.length})</h2>

      {/* Comment Form */}
      <div className="comment-form-container">
        <h3 className="comment-form-heading">Leave a Comment</h3>
        <form onSubmit={handleSubmit} className="comment-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">
              Message *
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="form-textarea"
              placeholder="Share your thoughts..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Submitting...' : 'Post Comment'}
          </button>
        </form>
      </div>

      {/* Comments List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <div className="comment-author">
                  <div className="author-avatar">
                    {comment.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="author-info">
                    <h4 className="author-name">{comment.name}</h4>
                    <p className="comment-date">{formatDate(comment.timestamp)}</p>
                  </div>
                </div>
              </div>
              <p className="comment-message">{comment.message}</p>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .comments-section {
          margin-top: 4rem;
          padding-top: 3rem;
          border-top: 2px solid var(--aws-light-gray);
        }

        .comments-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--aws-dark);
          margin-bottom: 2rem;
        }

        .comment-form-container {
          background: white;
          border: 2px solid var(--aws-light-gray);
          border-radius: 0.75rem;
          padding: 2rem;
          margin-bottom: 3rem;
        }

        .comment-form-heading {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--aws-dark);
          margin-bottom: 1.5rem;
        }

        .comment-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--aws-dark);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid var(--aws-light-gray);
          border-radius: 0.5rem;
          font-size: 1rem;
          color: var(--aws-dark);
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--aws-blue);
          box-shadow: 0 0 0 3px rgba(20, 110, 180, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .submit-button {
          background: var(--aws-orange);
          color: white;
          padding: 0.875rem 2rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          align-self: flex-start;
        }

        .submit-button:hover:not(:disabled) {
          background: var(--aws-blue);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(20, 110, 180, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .no-comments {
          text-align: center;
          color: var(--aws-dark-gray);
          font-size: 1.125rem;
          padding: 3rem;
          background: var(--aws-light-gray);
          border-radius: 0.75rem;
        }

        .comment-item {
          background: white;
          border: 2px solid var(--aws-light-gray);
          border-radius: 0.75rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .comment-item:hover {
          border-color: var(--aws-orange);
          box-shadow: 0 4px 12px rgba(255, 153, 0, 0.1);
        }

        .comment-header {
          margin-bottom: 1rem;
        }

        .comment-author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .author-avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: var(--aws-orange);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .author-info {
          flex: 1;
        }

        .author-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--aws-dark);
          margin-bottom: 0.25rem;
        }

        .comment-date {
          font-size: 0.875rem;
          color: var(--aws-dark-gray);
        }

        .comment-message {
          color: var(--aws-dark);
          line-height: 1.6;
          font-size: 1rem;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        /* Mobile Responsive Design */
        @media (max-width: 768px) {
          .comments-section {
            margin-top: 3rem;
            padding-top: 2rem;
          }

          .comments-title {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .comment-form-container {
            padding: 1.5rem;
          }

          .comment-form-heading {
            font-size: 1.25rem;
            margin-bottom: 1rem;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .comment-form {
            gap: 1rem;
          }

          .submit-button {
            width: 100%;
            text-align: center;
          }

          .comment-item {
            padding: 1rem;
          }

          .author-avatar {
            width: 2.5rem;
            height: 2.5rem;
            font-size: 1rem;
          }

          .author-name {
            font-size: 1rem;
          }

          .comment-date {
            font-size: 0.75rem;
          }

          .comment-message {
            font-size: 0.9375rem;
          }
        }
      `}</style>
    </div>
  );
}

// Helper function to get comment count (can be used in other components)
export function getCommentCount(postId: string): number {
  if (typeof window === 'undefined') return 0;

  const storageKey = `blog-comments-${postId}`;
  const stored = localStorage.getItem(storageKey);

  if (stored) {
    try {
      const comments = JSON.parse(stored);
      return comments.length;
    } catch (e) {
      return 0;
    }
  }

  return 0;
}
