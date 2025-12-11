import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug, getAllPostSlugs, formatDate } from '@/app/lib/posts';
import { withBasePath } from '@/app/lib/basePath';
import ReadingTimeBadge from '@/app/components/ReadingTimeBadge';

interface PostPageProps {
  params: {
    slug: string;
  };
}

/**
 * Generate static params for all blog posts
 * This enables static generation at build time
 */
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

/**
 * Generate metadata for the post page
 */
export async function generateMetadata({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.frontmatter.title} | AWS Claude Code Blog`,
    description: post.frontmatter.excerpt,
    keywords: post.frontmatter.tags,
    authors: [{ name: post.frontmatter.author }],
  };
}

/**
 * Individual blog post page
 * Server component - no client JavaScript
 */
export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);

  // If post not found or not published, show 404
  if (!post || !post.frontmatter.published) {
    notFound();
  }

  const { frontmatter, content, readingTime } = post;

  return (
    <article className="container mx-auto px-4 py-16">
      {/* Back to Home Link */}
      <Link
        href={withBasePath('/')}
        className="inline-block mb-8 text-aws-blue no-underline font-semibold"
      >
        ← Back to Home
      </Link>

      {/* Category Badge and Reading Time */}
      <div className="mb-4" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span className="category-badge">{frontmatter.category}</span>
        <ReadingTimeBadge minutes={readingTime} />
      </div>

      {/* Post Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{frontmatter.title}</h1>

        <div className="post-meta mb-4">
          {formatDate(frontmatter.date)} <span className="author">by {frontmatter.author}</span>
        </div>

        <div className="post-tags">
          {frontmatter.tags.map((tag) => (
            <span key={tag} className="tag-badge">
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* Post Content */}
      <div className="prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>

      {/* Back to Home Link (bottom) */}
      <div className="mt-16 pt-8" style={{ borderTop: '1px solid #e5e7eb' }}>
        <Link
          href={withBasePath('/')}
          className="inline-block text-aws-blue no-underline font-semibold"
        >
          ← Back to Home
        </Link>
      </div>
    </article>
  );
}
