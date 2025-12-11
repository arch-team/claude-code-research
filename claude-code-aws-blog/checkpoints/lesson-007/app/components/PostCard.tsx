import Link from 'next/link';
import { withBasePath } from '@/app/lib/basePath';
import { formatDate } from '@/app/lib/posts';
import type { Post } from '@/app/lib/posts';

interface PostCardProps {
  post: Post;
}

/**
 * PostCard component displays a blog post summary card
 * Server component - no client JavaScript required
 */
export default function PostCard({ post }: PostCardProps) {
  const { slug, frontmatter } = post;
  const { title, date, author, excerpt, category, tags } = frontmatter;

  return (
    <Link
      href={withBasePath(`/posts/${slug}`)}
      className="post-card no-underline"
    >
      {/* Category Badge */}
      <span className="category-badge">{category}</span>

      {/* Post Title */}
      <h3 className="post-title">{title}</h3>

      {/* Excerpt */}
      <p className="post-excerpt">{excerpt}</p>

      {/* Date and Author */}
      <div className="post-meta">
        {formatDate(date)} <span className="author">by {author}</span>
      </div>

      {/* Tags */}
      <div className="post-tags">
        {tags.map((tag) => (
          <span key={tag} className="tag-badge">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
